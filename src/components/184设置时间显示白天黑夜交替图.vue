
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-06
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 设置时间，显示白天黑夜场景图</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4> 
		      <el-date-picker
		        v-model="timeValue"
		        type="datetime"
				size="mini"
		        placeholder="选择日期时间">
		      </el-date-picker>
          <el-button type="primary" style="margin-left: 20px;" size="mini" @click="m(timeValue)">墨卡托投影</el-button>
          <el-button type="primary" size="mini"  @click="w(timeValue)">WGS84投影</el-button>
        </h4>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
	import 'ol-ext/dist/ol-ext.min.css'
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import Feature from 'ol/Feature'
    import {Point, LineString, Circle, Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import CircleStyle from 'ol/style/Circle'
	import DayNight from 'ol-ext/source/DayNight'
    import { fromLonLat } from 'ol/proj'

export default {
  data() {
    return {
        map:null,
		timeValue:new Date().getTime(),
		source: new DayNight({ }),
    };
  },

  methods:{
	m(time){
		this.map.setView(new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([0, 0]),
                        zoom: 1,
						maxZoom:10,
						minZoom:-4
                    }))
		this.source.refresh()	
		this.source.setTime(time)
	},
	w(time){
		this.map.setView(new View({
                        projection: "EPSG:4326",
                        center: [0, 0],
                        zoom: 1,
						maxZoom:10,
						minZoom:-4
                    }))
		this.source.refresh()
		this.source.setTime(time)
	},  	   
    
// 初始化地图     
     initMap(){      
            let OSM_Layer= new TileLayer({
                source: new OSM()
            })  
            let dnLayer=new VectorLayer({
                 source:this.source,  
				 style: new Style({
					  image: new CircleStyle({
						radius: 5,
						fill: new Fill({ color: 'red' })
					  }),
					  fill: new Fill({
						color: [0,0,50,.5]
					  })
					})
             })

            this.map= new Map({
                    target: "vue-openlayers",
                    layers: [
                        OSM_Layer,
                        dnLayer
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [0, 0],
                        zoom: 1,
						maxZoom:10,
						minZoom:-4
                    }),
                  })

            },          
  },  
  mounted() {
            this.initMap()
          }
      }

</script>
<style scoped>
    .container{
        width: 840px;
        height: 670px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 500px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
