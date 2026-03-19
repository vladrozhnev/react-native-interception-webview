package com.interceptionwebview

data class Config(
    var interruptionTimeout: Int = 5000,
    var hasOnShouldInterruptRequestHandler: Boolean = false,
    var skipInterceptionForFileExtensions: Set<String> = setOf(
        "aac","avi","avif","bmp","css","eot","gif","heic","heif","ico",
        "jpeg","jpg","js","m4a","m4v","mkv","mov","mp3","mp4","ogg",
        "pdf","png","svg","tiff","ttf","wav","webm","webp","woff","woff2"
    )
)
