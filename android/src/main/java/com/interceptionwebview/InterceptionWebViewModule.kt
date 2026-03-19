package com.interceptionwebview

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = InterceptionWebViewModule.NAME)
class InterceptionWebViewModule(reactContext: ReactApplicationContext) : NativeInterceptionWebViewModuleSpec(reactContext) {

    companion object {
        const val NAME = NativeInterceptionWebViewModuleSpec.NAME
    }

    @ReactMethod
    override fun setRequestAllowed(requestId: String, allowed: Boolean?) {
        LockManager.setAllowed(requestId, allowed ?: true)
    }
}
