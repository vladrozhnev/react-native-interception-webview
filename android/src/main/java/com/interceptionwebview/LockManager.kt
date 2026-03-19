package com.interceptionwebview

import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.Condition
import java.util.concurrent.locks.ReentrantLock

object LockManager {

    data class Lock(
        val allowed: AtomicBoolean = AtomicBoolean(false),
        val decided: AtomicBoolean = AtomicBoolean(false),
        val lock: ReentrantLock = ReentrantLock(),
        val condition: Condition = lock.newCondition()
    )

    private val locks = ConcurrentHashMap<String, Lock>()

    fun createLock(requestId: String): Lock {
        val lock = Lock()
        locks[requestId] = lock
        return lock
    }

    fun setAllowed(requestId: String, allowed: Boolean) {
        locks[requestId]?.let { lock ->
            lock.allowed.set(allowed)
            lock.decided.set(true)
            lock.lock.lock()
            try {
                lock.condition.signalAll()
            } finally {
                lock.lock.unlock()
            }
        }
    }

    fun removeLock(requestId: String) {
        locks.remove(requestId)
    }
}
