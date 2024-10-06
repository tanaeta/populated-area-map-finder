import React, { useState,useEffect } from 'react';
import { GeoJSON, MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import Slider, {Range} from 'rc-slider';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import DateSlider from './DateSlider.js';

// 2020年から2025年までの月の配列を作成
const createMonthsArray = (startYear, endYear) => {
  const months = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(parseInt(moment([year, month - 1]).format('YYYYMM')));
    }
  }
  return months;
};
const validMonths = createMonthsArray(2020, 2025);

const MapComponent = () => {  
  const position = [35.6895,139.6917];
  const [geojsonData, setGeojsonData] = useState(null);
  const [minPopulation, setMinPopulation] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(2025, 12, 31), new Date(2025, 12, 31)]);

  // スライダーの値が変更されたときのハンドラー
  const handlePopulationSliderChange = (value) => {
    setMinPopulation(value);
  };

  const handleDateSliderChange = (value) => {
    setDateRange(dateRange.map((date, index) => {
      return index === 1 ? date : value;
    }));
  };

  // 日付のフォーマット
  const formatMonth = (value) => {
    return moment(value, 'YYYYMM').format('YYYY-MM');
  };
  const formatDate = (value) => {
    return moment(value, 'YYYYMMDD').format('YYYY-MM-DD');
  };

  useEffect(() => {
    const jsonload = () =>{
      fetch('/geojson/sample.json')
        .then(response => response.json())
        .then(data => setGeojsonData(data));
    }
    jsonload();
  }, []);

  return (
    <>
      <MapContainer 
        center={position} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/** geojsonをロードしてMarkerとして表示 */}
        {geojsonData && geojsonData.features.map((feature, index) => {
          const featureMonth = parseInt(moment(feature.properties.registrationDate).format('YYYYMM'));

          return feature.properties.population >= minPopulation &&
          featureMonth >= moment(dateRange[0]).format('YYYYMM') &&
          featureMonth <= moment(dateRange[1]).format('YYYYMM') ? (
            <Marker 
              key={index} 
              position={[
                feature.geometry.coordinates[1], 
                feature.geometry.coordinates[0]
              ]}
            >
              <Popup>
                {feature.properties.name || 'No name'}<br />
                Population:{feature.properties.population || 'No population'}
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>

      {/** 人口スライダー */}
      <div style={{ margin: '20px' }}>
        <h3>Population Filter</h3>
        <Slider
          min={0}
          max={20000000}
          defaultValue={0}
          onChange={handlePopulationSliderChange}
          railStyle={{ backgroundColor: 'gray' }}
          trackStyle={{ backgroundColor: 'blue' }}
          handleStyle={{ borderColor: 'blue' }}
        />
        <div>Minimum Population: {minPopulation}</div>
      </div>

      {/** 日付スライダー */}
      <div style={{ margin: '20px' }}>
        <DateSlider range
          onChange={handleDateSliderChange}
          min={new Date(2022, 1, 1)}
          max={new Date(2025, 12, 31)}
          defaultValue={new Date(2025, 12, 31)}
          />
        <div>
          Selected Range: {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
        </div>
      </div>
    </>
  )
};

export default MapComponent;