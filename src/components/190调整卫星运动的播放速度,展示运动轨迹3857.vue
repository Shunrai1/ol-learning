/*
* @Author: 大剑师兰特（xiaozhuanlan）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-30
*/
<template>
    <div class="container">
       <h3>vue+openlayers: 调整卫星运动的播放速度，展示运动轨迹</h3>
      <p>大剑师兰特，还是大剑师兰特</p>
		<h4>
			    <el-slider
			      v-model="beishu"
			      :step="5"
				  :min=0
				  :max=100
			      show-stops
				  @change='setMultiple()'>
			    </el-slider>
				 {{beishu}}X
		</h4>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Point, LineString, Circle, Polygon} from "ol/geom"
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import Text from 'ol/style/Text'
import { fromLonLat } from 'ol/proj'
// 引用satellitejs和dayjs 
  const satellite = require('satellite.js');
  import dayjs from "dayjs";
  var utc = require('dayjs/plugin/utc')
  dayjs.extend(utc)

    export default {
        name: 'Mapbox',
        data(){
            return {
				beishu:0,
                map:null,
                satimg:require('../assets/img/satellite.svg'),
				startTime:0,

                satList:[
                    {
                        name:"sat1",
                        color:"red",
                        trackColor:"red",
                        tleLine1 : '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
                        tleLine2 : '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442',
                    },
                    {
                        name:"sat2",
                        color:"blue",
                        trackColor:"Orange",
                        tleLine1 : '1 43011U 17072B   22069.21269118  .00000142  00000+0  77818-4 0  9996',
                        tleLine2 : '2 43011  98.8426  33.5195 0010670   2.3448 357.7789 14.26536800224772',
                    },
                    {
                        name:"sat3",
                        color:"yellow",
                        trackColor:"Green",
                        tleLine1 : '1 43076U 17083G   22068.55663055  .00000057  00000+0  13324-4 0  9990',
                        tleLine2 : '2 43076  86.3934 254.2469 0001881  99.1957 260.9451 14.34218877220483',
                    },

                ],              

                satelliteSource:new VectorSource({ wrapX: false }), 
            }
        },
        methods: {
			setMultiple(){
				this.startTime=(new Date()).getTime()
			},
			
             // 定时器，1秒钟计算显示卫星位置    
             timer() { 
               return setInterval(()=>{ 
				let  ctime=(new Date()).getTime()
				let  dtime= ctime - this.startTime  
				let  runTime = this.startTime + dtime*this.beishu
                  this.getSatInfo(runTime) 
              },10) 
            } ,

            // 根据时间获取卫星的坐标点
            onePoint(timePoint,t1,t2){
                let satrec = satellite.twoline2satrec(t1, t2);
                let positionAndVelocity = satellite.propagate(satrec, timePoint);
                var positionEci = positionAndVelocity.position;
                let gmst = satellite.gstime(timePoint);
                let positionGd= satellite.eciToGeodetic(positionEci, gmst);
                let a=satellite.degreesLong(positionGd.longitude)
                let b=satellite.degreesLong(positionGd.latitude)
                let lonlat=fromLonLat([a,b])
                return lonlat
            },

            // 显示卫星
            getSatInfo(t){               
                let satFeatures=[];
                for(let j=0;j<this.satList.length;j++){
	
                    let aaa=this.onePoint(dayjs(t).toDate(),this.satList[j].tleLine1,this.satList[j].tleLine2)
                    //获取5分钟后的坐标点
                    let bbb=this.onePoint(dayjs(t+300000).toDate(),this.satList[j].tleLine1,this.satList[j].tleLine2)
                    let dx = bbb[0] - aaa[0]
                    let dy = bbb[1] - aaa[1]
                    //调整卫星图旋转角度，原始图有0.887的倾角
                    let rotation = Math.atan2(dy, dx)+0.887   
                    let satFeature=this.showPoint(aaa,-rotation,this.satList[j].color,this.satList[j].name)
                    satFeatures.push(satFeature)                    
                }
                this.satelliteSource.addFeatures(satFeatures)
            },
            // 显示卫星层
            showPoint(x,y,z,t){
                this.satelliteSource.clear();
                let pointFeature= new Feature({
                    geometry: new Point(x),             
                })
                pointFeature.setStyle(this.satStyle(y,z,t))
                return pointFeature

            },

            // 设置卫星的样式
            satStyle(y,z,t){
                let style=new Style({                                       
                              image: new Icon({
                                src: this.satimg,
                                anchor: [0.5, 0.5],
                                scale: 1,
                                rotation:y,
                                color:z
                            }),
                                text: new Text({
                                font: '12px sans-serif', // 设置字体
                                maxAngle: 30,
                                textAlign: 'right',
                                offsetx: 30, // 设置文字偏移量
                                offsetY: 20,
                                text:t, // 文字描述
                                fill: new Fill({
                                color: '#666',
                                 }),
                            })               
                })
                return style            
            },


            initMap() {

                let satelliteLayer=new VectorLayer({
                    source:this.satelliteSource
                })

                this.map = new Map({
                  layers: [
                    new TileLayer({
                      source: new XYZ({
						url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					  }),
                    }),
                    satelliteLayer

                  ],
                  target: 'vue-openlayers',
                  view: new View({
                    center: fromLonLat([116, 39]),
                    projection:"EPSG:3857",
                    zoom: 1,
                  }),
                });

            },
        },
        mounted() {
            this.initMap();         
            this.timer();
        },
        destroyed() { 
          clearInterval(this.timer()) ;
        } 
    }
</script>

<style scoped>
    .container{
        width: 840px;
        height: 620px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 440px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
	h4{ width: 80%; margin:5px auto;}
</style>


