/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-17
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 计算并显示卫星轨迹（EPSG:3857）</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Point, LineString, Circle, Polygon} from "ol/geom"
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import {fromLonLat} from 'ol/proj'
// 引用satellitejs和dayjs 
  const satellite = require('satellite.js');
  import dayjs from "dayjs";
  var utc = require('dayjs/plugin/utc')
  dayjs.extend(utc)

    export default {
        name: 'Mapbox',
        data(){
            return {
                map:null,
                satimg:require('../assets/img/satellite.svg'),
                tleLine1 : '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
                tleLine2 : '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442',
                satelliteSource:new VectorSource({ wrapX: true }), 
                satelliteTrackSource:new VectorSource({ wrapX: true }), 
            }
        },
        methods: {
             // 定时器，1秒钟计算显示卫星位置    
             timer() { 
               return setInterval(()=>{ 
                  this.getSatInfo() 
              },1000) 
            } ,

            // 获取卫星的运行轨迹            
            getSatTrack(){              
                let curTime=new Date();
                let lineData=[];
                for(let i=0;i<50;i++){
                    // 每隔1分钟获取一个点,列出50分钟的轨迹线
                    let newTimePoint= dayjs(curTime).add(i, "minute").toDate()
                    let one=this.onePoint(newTimePoint)
                    lineData.push(one)
                 }
                console.log(lineData)
                this.showTrack(lineData);
            },
            // 根据时间获取卫星的坐标点
            onePoint(timePoint){
                let satrec = satellite.twoline2satrec(this.tleLine1, this.tleLine2);
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
            getSatInfo(){
                let aaa=this.onePoint(new Date())
                let min5=dayjs(new Date()).add(5, "minute").toDate()  
                //获取5分钟后的坐标点
                let bbb=this.onePoint(min5)
                let dx = bbb[0] - aaa[0]
                let dy = bbb[1] - aaa[1]
                //调整卫星图旋转角度，原始图有0.887的倾角
                let rotation = Math.atan2(dy, dx)+0.887                    
                this.showPoint(aaa,-rotation)
            },
            // 显示卫星层
            showPoint(x,y){
                this.satelliteSource.clear();
                let pointFeature= new Feature({
                    geometry: new Point(x),             
                })
                pointFeature.setStyle(this.satStyle(y))
                this.satelliteSource.addFeature(pointFeature)
            },
            // 显示卫星轨迹层
            showTrack(x){
                this.satelliteTrackSource.clear();
                let lineFeature= new Feature({
                    geometry: new LineString(x),                
                })
                lineFeature.setStyle(this.trackStyle())
                this.satelliteTrackSource.addFeature(lineFeature)
            },

            // 设置卫星轨迹的样式
            trackStyle(){
                let style=new Style({
                                fill:new Fill({
                                    color:"#00f"
                                }),
                                stroke:new Stroke({
                                    width:2,
                                    color:"orange",
                                }),     
                })
                return style            
            },

            // 设置卫星的样式
            satStyle(y){
                let style=new Style({                                       
                              image: new Icon({
                                src: this.satimg,
                                anchor: [0.5, 0.5],
								color:'#f00',
                                scale: 1,
                                rotation:y
                            })          
                })
                return style            
            },

            initMap() {
                let satelliteLayer=new VectorLayer({
                    source:this.satelliteSource
                })
                let satelliteTrackLayer=new VectorLayer({
                    source:this.satelliteTrackSource
                })

                this.map = new Map({
                  layers: [
                    new TileLayer({
                      source: new OSM(),
                    }),
                    satelliteTrackLayer,
                    satelliteLayer

                  ],
                  target: 'vue-openlayers',
                  view: new View({
                    center: fromLonLat([116, 39]),
                    projection:"EPSG:3857",
                    zoom: 2,
                  }),
                });
                // 显示运行轨迹
                this.getSatTrack()
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
        height: 520px;
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


