
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
        <h3>vue+openlayers: 设置矢量线段粗细、渐变颜色，设置箭头和线头样式</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4> 
          <el-button type="primary" size="mini" @click="featureStyle('blue','orange',3,3,'purple',2,'round')">双箭头</el-button>
          <el-button type="primary" size="mini"  @click="featureStyle('purple','red',3,7,'darkRed',1,'butt')">后箭头</el-button>
          <el-button type="primary" size="mini"  @click="featureStyle('green','brown',7,3,'blue',0,'round')">没箭头</el-button>
          <el-button type="primary" size="mini"  @click="featureStyle('yellow','black',6,6,'blue',-1,'butt')">前剪头</el-button>
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

	import FlowLine from 'ol-ext/style/FlowLine'

export default {
  data() {
    return {
        map:null,
        dataSource: new VectorSource({ wrapX: false }), 
        feature_Layer:null,
        lineData1:[
              [116,39],
              [116.005, 39.37],
              [116.025, 39.635]
        ],
		lineData2:[
		      [116.36,39.36],
		      [116.035, 39.36],
		      [116.085, 39.625]
		],
       
    };
  },

  methods:{
        // 设置样式
        featureStyle(c1,c2,w1,w2,ac,a,lc){
			let style= new FlowLine({
				color: c1,  //前部颜色
				color2: c2, //后部颜色
				width: w1, //前部宽度
				width2:w2,  //后部宽度
				arrowColor:ac, //箭头颜色
				arrow:a,  //箭头样式 -1前箭头；0没箭头；1后箭头； 2双箭头
				lineCap:lc //线头样式  round  butt
			  });
			this.feature_Layer.setStyle(style)		   
        },

        showLine(){
            let lineFeature1= new Feature({
                geometry: new LineString(this.lineData1),                
            })
			let lineFeature2= new Feature({
			    geometry: new LineString(this.lineData2),                
			})
            this.dataSource.addFeature(lineFeature1)
			this.dataSource.addFeature(lineFeature2)
        },      
    
// 初始化地图     
     initMap(){      
            let OSM_Layer= new TileLayer({
                source: new OSM()
            })  
             this.feature_Layer=new VectorLayer({
                 source:this.dataSource,         
             })

            this.map= new Map({
                    target: "vue-openlayers",
                    layers: [
                        OSM_Layer,
                        this.feature_Layer
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [116.005, 39.37],
                        zoom: 10
                    }),
                  })

            },          
  },  
  mounted() {
            this.initMap()
			this.showLine()
          }
      }

</script>
<style scoped>
    .container{
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
