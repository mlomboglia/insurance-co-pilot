'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}

    // Observe Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime
            }
            break
          case 'largest-contentful-paint':
            metrics.lcp = (entry as any).startTime
            break
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value
            }
            break
          case 'navigation':
            metrics.ttfb = (entry as any).responseStart - entry.startTime
            break
        }
      }
    })

    // Start observing
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] })
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance monitoring not fully supported:', error)
    }

    // Report metrics after page load
    const reportMetrics = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Performance Metrics:', metrics)
      }

      // In production, send to analytics service
      if (typeof window !== 'undefined' && 'gtag' in window) {
        Object.entries(metrics).forEach(([metric, value]) => {
          if (value !== undefined) {
            (window as any).gtag('event', 'timing_complete', {
              name: metric,
              value: Math.round(value)
            })
          }
        })
      }
    }

    // Report after a delay to capture all metrics
    const timeoutId = setTimeout(reportMetrics, 3000)

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  return null // This component doesn't render anything
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const trackTiming = (name: string, startTime: number) => {
    const duration = performance.now() - startTime

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration)
      })
    }
  }

  const trackUserTiming = (markName: string) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(markName)
    }
  }

  const measureUserTiming = (measureName: string, startMark: string, endMark?: string) => {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(measureName, startMark, endMark)
        const measure = performance.getEntriesByName(measureName)[0]
        if (measure) {
          trackTiming(measureName, performance.now() - measure.duration)
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error)
      }
    }
  }

  return {
    trackTiming,
    trackUserTiming,
    measureUserTiming
  }
}