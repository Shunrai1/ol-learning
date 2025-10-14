
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-07
*/

<template>
    <div class="container">
        <h3>vue+openlayers:引用hover效果，展示各种鼠标cursor样式</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4> 
          <el-button type="success" size="mini" @click="showPoint()">显示点</el-button>
          <el-button type="success" size="mini"  @click="showLine()">显示线</el-button>
          <el-button type="success" size="mini"  @click="showCircle()">显示圆</el-button>
          <el-button type="success" size="mini"  @click="showPolygon()">显示多边形</el-button>
          <el-button type="primary" size="mini"  @click="clearLayer()">清除图层</el-button>
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
	import Hover from 'ol-ext/interaction/Hover' //核心引用

export default {
  data() {
    return {
        map:null,
        dataSource: new VectorSource({ wrapX: false }), 
        pointData:[116, 39],
        lineData:[
              [116,39],
              [116.005, 39],
              [116.005, 39.015]
        ],
        polygonData:[[ 
                [116.015, 39.005],
                [116.016, 39.018],
                [116.028, 39.008],
                [116.015, 39.005]
        ]],
        circleData:{ circleCenter:[115.992, 39],circleRadius:0.005},            
    };
  },

  methods:{
        // 设置vector样式
        featureStyle(){
            let style=new Style({
                      fill:new Fill({
                          color:"darkBlue"
                      }),
                      stroke:new Stroke({
                          width:2,
                          color:"orange",
                      }),
                      image: new CircleStyle({  //点样式
                        radius: 10, 
                        fill: new Fill({
                          color: '#ff0000'
                        })
                      }),                
            })
            return style            
        },
         // 清除vector数据源
        clearLayer(){
            this.dataSource.clear(); 
        },
        // 显示点
        showPoint(){
            let pointFeature= new Feature({
                geometry: new Point(this.pointData),                
            })
            this.dataSource.addFeature(pointFeature)
        },
        // 显示线段
        showLine(){
            let lineFeature= new Feature({
                geometry: new LineString(this.lineData),                
            })
            this.dataSource.addFeature(lineFeature)
        },      
        // 显示圆形
        showCircle(){
            let circleFeature= new Feature({
                geometry: new Circle(this.circleData.circleCenter,this.circleData.circleRadius),                
            })
            this.dataSource.addFeature(circleFeature)
        },      
        // 显示多边形
        showPolygon(){
            let polygonFeature= new Feature({
                geometry: new Polygon(this.polygonData),                
            })
            this.dataSource.addFeature(polygonFeature)
        },      
// 初始化地图     
     initMap(){      
            let OSM_Layer= new TileLayer({
                source: new OSM()
            })  
             let feature_Layer=new VectorLayer({
                 source:this.dataSource,
                 style:this.featureStyle() //统一设置vector样式
             })

            this.map= new Map({
                    target: "vue-openlayers",
                    layers: [
                        OSM_Layer,
                        feature_Layer
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [116,39],
                        zoom: 14
                    }),
                  })
             let hover=new Hover({ cursor: "pointer" })
			 this.map.addInteraction(hover);
			     hover.on("enter", (e)=>{
			       switch (e.feature.getGeometry().getType()) {
			         case "LineString":
			           hover.setCursor("copy");
			           break;
			         case "Polygon":
			           hover.setCursor("help");
			           break;
					 case "Point":
					   hover.setCursor("wait");
					   break;
					 case "Circle":
					   hover.setCursor("ne-resize");
					   break;  
			         default:
			           hover.setCursor("pointer");
			           break;
			       }
				   this.$message({
					   message:e.feature.getGeometry().getType(),
					   type:'success',
					   duration:1000
				   })
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
