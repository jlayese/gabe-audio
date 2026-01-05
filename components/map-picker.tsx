"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialPosition?: { lat: number; lng: number }
  isEditable?: boolean
}

// Default to Cebu City center
const defaultPosition = { lat: 10.294889, lng: 123.896601 }

export function MapPicker({
  onLocationSelect,
  initialPosition = defaultPosition,
  isEditable = true,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isClient, setIsClient] = useState(false)

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [initialPosition.lat, initialPosition.lng],
      zoom: 13,
      zoomControl: true,
      dragging: isEditable,
      scrollWheelZoom: isEditable,
      doubleClickZoom: isEditable,
      boxZoom: isEditable,
      keyboard: isEditable,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const marker = L.marker([initialPosition.lat, initialPosition.lng], {
      draggable: isEditable,
    }).addTo(map)

    mapInstanceRef.current = map
    markerRef.current = marker

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isEditable) return
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onLocationSelect(lat, lng)
    }

    const handleMarkerDrag = () => {
      if (!isEditable) return
      const position = marker.getLatLng()
      onLocationSelect(position.lat, position.lng)
    }

    map.on("click", handleMapClick)
    marker.on("dragend", handleMarkerDrag)

    return () => {
      map.off("click", handleMapClick)
      marker.off("dragend", handleMarkerDrag)
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [initialPosition.lat, initialPosition.lng, onLocationSelect, isEditable])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    initializeMap()
  }, [isClient, initializeMap])

  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return

    const newPosition = [initialPosition.lat, initialPosition.lng] as [number, number]
    markerRef.current.setLatLng(newPosition)

    const currentZoom = mapInstanceRef.current.getZoom()
    mapInstanceRef.current.setView(newPosition, currentZoom, { animate: true })
  }, [initialPosition.lat, initialPosition.lng])

  if (!isClient) {
    return (
      <div className="h-[300px] w-full rounded-md overflow-hidden border border-border bg-muted animate-pulse" />
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-[300px] w-full rounded-md overflow-hidden border border-border"
    />
  )
}

