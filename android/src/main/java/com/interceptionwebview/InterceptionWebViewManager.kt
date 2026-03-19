package com.interceptionwebview

import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.InterceptionWebViewManagerDelegate
import com.facebook.react.viewmanagers.InterceptionWebViewManagerInterface
import com.reactnativecommunity.webview.RNCWebViewClient
import com.reactnativecommunity.webview.RNCWebViewManager
import com.reactnativecommunity.webview.RNCWebViewWrapper
import java.util.concurrent.TimeUnit
import java.util.UUID

@ReactModule(name = InterceptionWebViewManager.NAME)
class InterceptionWebViewManager : RNCWebViewManager(),
InterceptionWebViewManagerInterface<RNCWebViewWrapper> {

    companion object {
        const val NAME = "InterceptionWebView"
        const val INTERCEPTION_CONFIG_TAG = 0x7F0F0001
        private val ALLOWED_SCHEMES = setOf("http", "https")
    }

    private val mDelegate: ViewManagerDelegate<RNCWebViewWrapper>

    private fun RNCWebViewWrapper.getConfig(): Config {
        return getTag(INTERCEPTION_CONFIG_TAG) as Config
    }

    init {
        mDelegate = InterceptionWebViewManagerDelegate(this)
    }

    override fun getName(): String {
        return NAME
    }

    override fun getDelegate(): ViewManagerDelegate<RNCWebViewWrapper>? {
        return mDelegate
    }

    override fun createViewInstance(reactContext: ThemedReactContext): RNCWebViewWrapper {
        val view = super.createViewInstance(reactContext)
        view.setTag(INTERCEPTION_CONFIG_TAG, Config())
        return view
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        val map = super.getExportedCustomDirectEventTypeConstants() ?: mutableMapOf()
        map["topShouldInterruptRequest"] = mapOf("registrationName" to "onShouldInterruptRequest")
        map["topInterceptRequest"] = mapOf("registrationName" to "onInterceptRequest")
        return map
    }

    override fun addEventEmitters(reactContext: ThemedReactContext, view: RNCWebViewWrapper) {
        super.addEventEmitters(reactContext, view)

        val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, view.id)
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        view.webView.webViewClient = object : RNCWebViewClient() {
            override fun shouldInterceptRequest(webView: WebView, request: WebResourceRequest): WebResourceResponse? {
                val uri = request.url
                val config = view.getConfig()

                val scheme = uri.scheme.orEmpty().lowercase()
                val shouldSkipByScheme = scheme !in ALLOWED_SCHEMES
                if (shouldSkipByScheme) return null

                val path = Uri.decode(uri.path.orEmpty().lowercase())
                val shouldSkipByPath = config.skipExtensions.any { path.endsWith(".$it") }
                if (shouldSkipByPath) return null

                val query = Uri.decode(uri.query.orEmpty().lowercase())
                val regex = Regex("\\.(${config.skipExtensions.joinToString("|")})($|[?&/=,])")
                val shouldSkipByQuery = regex.containsMatchIn(query)
                if (shouldSkipByQuery) return null

                val requestId = UUID.randomUUID().toString()
                val eventData = Utils.buildEventData(request, requestId)
                dispatcher?.dispatchEvent(InterceptionEvent(surfaceId, view.id, eventData))
                
                if (!config.hasInterruptHandler) return null

                val lock = LockManager.createLock(requestId)
                dispatcher?.dispatchEvent(InterruptionEvent(surfaceId, view.id, eventData))
                lock.lock.lock()

                try {
                    val endTime = System.currentTimeMillis() + config.timeout
                    while (!lock.decided.get()) {
                        val remaining = endTime - System.currentTimeMillis()
                        if (remaining <= 0) break
                        lock.condition.await(remaining, TimeUnit.MILLISECONDS)
                    }
                } finally {
                    lock.lock.unlock()
                }

                val allowed = if (lock.decided.get()) lock.allowed.get() else true
                LockManager.removeLock(requestId)
                return if (allowed) null else WebResourceResponse("text/plain", "UTF-8", null)
            }
        }
    }

    @ReactProp(name = "interruptionTimeout")
    override fun setInterruptionTimeout(view: RNCWebViewWrapper, timeout: Int) {
        view.getConfig().timeout = timeout.coerceIn(0, 60000)
    }

    @ReactProp(name = "hasInterruptHandler")
    override fun setHasInterruptHandler(view: RNCWebViewWrapper, value: Boolean) {
        view.getConfig().hasInterruptHandler = value ?: false
    }

    @ReactProp(name = "skipInterceptionForExtensions")
    override fun setSkipInterceptionForExtensions(view: RNCWebViewWrapper, extensions: ReadableArray?) {
        val set = mutableSetOf<String>()

        extensions?.let {
            for (i in 0 until it.size()) {
                it.getString(i)
                    ?.trim()
                    ?.lowercase()
                    ?.takeIf { ext -> ext.isNotEmpty() }
                    ?.let { normalizedExt -> set.add(normalizedExt) }
            }
        }

        view.getConfig().skipExtensions = set
    }
}
