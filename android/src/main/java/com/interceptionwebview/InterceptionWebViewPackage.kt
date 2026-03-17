package com.interceptionwebview

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class InterceptionWebViewPackage : BaseReactPackage() {

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(InterceptionWebViewManager())
    }

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        if (name != InterceptionWebViewModule.NAME) {
            return null
        }

        return InterceptionWebViewModule(reactContext)
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                InterceptionWebViewModule.NAME to ReactModuleInfo(
                    name = InterceptionWebViewModule.NAME,
                    className = InterceptionWebViewModule.NAME,
                    canOverrideExistingModule = false,
                    needsEagerInit = false,
                    isCxxModule = false,
                    isTurboModule = true
                )
            )
        }
    }
}
