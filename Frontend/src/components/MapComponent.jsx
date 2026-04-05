import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaMapMarkerAlt } from "react-icons/fa";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



const DEFAULT_POSITION = [10.7769, 106.7009];

const latitude = Number.parseFloat(import.meta.env.VITE_MY_LOCATION_LATITUDE);
const longitude = Number.parseFloat(import.meta.env.VITE_MY_LOCATION_LONGITUDE);

const MapControls = ({ onZoomChange }) => {
  const map = useMap();

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return (
    <>
      <div className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md z-20">
        <FaMapMarkerAlt className="text-gray-800" size={24} />
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2 bg-white rounded-lg p-2 shadow-md z-20">
        <button
          type="button"
          className="px-3 py-1 text-gray-700 hover:text-gray-900"
          onClick={() => {
            map.zoomIn();
            onZoomChange(map.getZoom());
          }}
        >
          Zoom in
        </button>
        <button
          type="button"
          className="px-3 py-1 text-gray-700 hover:text-gray-900"
          onClick={() => {
            map.zoomOut();
            onZoomChange(map.getZoom());
          }}
        >
          Zoom out
        </button>
      </div>
    </>
  );
};

const MapComponent = () => {
  const position = useMemo(
    () =>
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? [latitude, longitude]
        : DEFAULT_POSITION,
    []
  );
  const [zoomLevel, setZoomLevel] = useState(15);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">

      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={true} 
        className="w-full h-full transition-transform duration-300 ease-in-out"
        onZoomEnd={(e) => setZoomLevel(e.target.getZoom())} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup className="custom-popup bg-white p-2 rounded-md shadow-lg">
            <div style={{ textAlign: "center" }}>
              <h3 className="text-lg font-semibold">Cửa hàng The Shoe Shop</h3>
              <p className="text-sm">Rất vui được đón bạn ghé xem sản phẩm.</p>
            </div>
          </Popup>
        </Marker>
        <MapControls onZoomChange={setZoomLevel} />
      </MapContainer>
      <div className="absolute bottom-4 right-4 bg-white rounded-lg px-3 py-2 shadow-md z-20 text-sm text-gray-700">
        Mức zoom: {zoomLevel}
      </div>
    </div>
  );
};

export default MapComponent;
