package com.interceptionwebview

import android.net.Uri
import android.webkit.WebResourceRequest
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

object Utils {

    fun buildEventData(request: WebResourceRequest, requestId: String): WritableMap {
        val uri = request.url
        val url = Uri.decode(uri.toString())
        val scheme = uri.scheme.orEmpty().lowercase()
        val host = uri.host.orEmpty().lowercase()
        val path = Uri.decode(uri.path.orEmpty())
        val fragment = Uri.decode(uri.fragment.orEmpty())
        val query = Uri.decode(uri.query.orEmpty())

        return Arguments.createMap().apply {
            putString("url", url)
            putString("scheme", scheme)
            putString("host", host)
            putString("path", path)
            putString("fragment", fragment)
            putString("method", request.method.uppercase())
            putString("requestId", requestId)
            putString("query", query)
        }
    }
}
