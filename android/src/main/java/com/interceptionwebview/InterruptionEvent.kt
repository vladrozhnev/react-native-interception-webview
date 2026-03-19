package com.interceptionwebview

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter

class InterruptionEvent(surfaceId: Int, viewTag: Int, private val eventData: WritableMap) : Event<InterruptionEvent>(surfaceId, viewTag) {

    override fun getEventName(): String {
        return "topShouldInterruptRequest"
    }

    override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {
        rctEventEmitter.receiveEvent(surfaceId, viewTag, eventName, eventData)
    }
}
