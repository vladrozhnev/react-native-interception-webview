package com.interceptionwebview

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter

class InterceptionEvent(surfaceId: Int, viewTag: Int, private val eventData: WritableMap) : Event<InterceptionEvent>(surfaceId, viewTag) {

    override fun getEventName(): String {
        return "topShouldInterceptRequest"
    }

    override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {
        rctEventEmitter.receiveEvent(surfaceId, viewTag, eventName, eventData)
    }
}
