/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-24
*/

<template>
    <div class="container">
        <h3>vue+openlayers: select-modify-snap功能展示</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import SourceVector from 'ol/source/Vector'
import LayerVector from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import {Tile} from 'ol/layer';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import {Draw, Modify, Select, Snap} from 'ol/interaction';

// 引用数据
import CN from '@/assets/data/MapOfChina.json'
export default {
  name: 'VectorJSON',
  data () {
    return {
      map: null,
      source: new SourceVector({
         // 解析数据 
        features: new GeoJSON().readFeatures(CN, {
          dataProjection: 'EPSG:4326',
          featureProjection: "EPSG:3857"
        })
      }),
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat([116.403963,39.915119]) , // 中国
        zoom: 3
      })
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target:'vue-openlayers',
        layers: [
          new Tile({
              source:new OSM()
          }),   
          new LayerVector({
            source: this.source
          }),

        ],
        view: this.view
      })
	  
	  
	const select = new Select();	  
	const modify = new Modify({
	    features: select.getFeatures(),
	  });
	const snap = new Snap({
	    source: this.source,
	  });
	  
	this.map.addInteraction(select);
	this.map.addInteraction(modify);
	this.map.addInteraction(snap);
	  
    }
  },
  mounted () {
   
	 this.initMap();
  }
}
</script>

<style scoped>
    .container{
        width: 840px;
        height: 550px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 420px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
