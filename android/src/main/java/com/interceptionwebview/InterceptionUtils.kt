package com.interceptionwebview

import android.net.Uri
import android.webkit.WebResourceRequest
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

object InterceptionUtils {

    fun buildEventData(request: WebResourceRequest, requestId: String): WritableMap {
        val uri = request.url
        val url = Uri.decode(uri.toString())
        val scheme = uri.scheme.orEmpty().lowercase()
        val host = uri.host.orEmpty().lowercase()
        val path = Uri.decode(uri.path.orEmpty())
        val fragment = Uri.decode(uri.fragment.orEmpty())

        val eventData = Arguments.createMap().apply {
            putString("url", url)
            putString("scheme", scheme)
            putString("host", host)
            putString("path", path)
            putString("fragment", fragment)
            putString("method", request.method.uppercase())
            putString("requestId", requestId)
            putBoolean("isForMainFrame", request.isForMainFrame)
            putBoolean("isRedirect", request.isRedirect)

            val query = Arguments.createMap().apply {
                val raw = Uri.decode(uri.query.orEmpty())
                val params = Arguments.createMap().apply {
                    uri.queryParameterNames.forEach { key ->
                        val values = uri.getQueryParameters(key)
                        if (values.size == 1) {
                            putString(key, values[0])
                        } else if (values.isNotEmpty()) {
                            val array = Arguments.createArray()
                            values.forEach { array.pushString(it) }
                            putArray(key, array)
                        }
                    }
                }

                putString("raw", raw)
                putMap("params", params)
            }

            val headers = Arguments.createMap().apply {
                request.requestHeaders.forEach { (key, value) ->
                    putString(key, value.trim().replace("\\\\", "\\").replace("\\\"", "\""))
                }
            }

            putMap("headers", headers)
            putMap("query", query)
        }

        return eventData
    }
}
