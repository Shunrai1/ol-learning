
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-02-06
*/

<template>
    <div class="container">
       <h3>vue+openlayers:圆孔相机根据卫星经度、纬度、高度、半径比例推算绘制地面的拍摄的区域</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div class="nav">
        <el-input v-model="lon" size="mini"><template slot="prepend">经度</template></el-input>
        <el-input v-model="lat" size="mini"><template slot="prepend">纬度</template></el-input>
        <el-input v-model="alt" size="mini"><template slot="prepend">高度</template></el-input>
        <el-input v-model="pitch" size="mini" disabled><template slot="prepend"> 俯仰角</template></el-input>
        <el-input v-model="proportion" size="mini" ><template slot="prepend">拍摄比例</template></el-input>
        <el-button type="primary" size="mini"  @click="showCircle()">显示圆形</el-button>
        <el-button type="primary" size="mini"  @click="clearLayer()">清除图层</el-button>
        </div>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import XYZ from 'ol/source/XYZ'
    import Feature from 'ol/Feature'
    import {Point, LineString,  Polygon, Circle} from "ol/geom"
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import CircleStyle from 'ol/style/Circle'
    import {fromLonLat,transform} from 'ol/proj'
    import {getCenter} from 'ol/extent';

export default {
  data() {
    return {
        map:null,
        dataSource: new VectorSource({ wrapX: false }), 
        lon:16.3979471,
        lat:39.9081726,
        alt: 500000,
        pitch: 0,
        proportion:2,		        
    };
  },

  methods:{
        // 设置vector样式
        featureStyle(){
            let style=new Style({
                      fill:new Fill({
                          color:"rgba(0,0,0,0.1)"
                      }),
                      stroke:new Stroke({
                          width:2,
                          color:"#f00",
                      }),
                      image: new CircleStyle({  //点样式
                        radius: 3, 
                        fill: new Fill({
                          color: '#0000ff'
                        })
                      }),                
            })
            return style            
        },
         // 清除vector数据源
        clearLayer(){
            this.dataSource.clear(); 
        },

        showCircle(){
			let r=this.alt/this.proportion
            let cc=fromLonLat([this.lon, this.lat])
            let circleFeature= new Feature({
                geometry: new Circle(cc, r)              
            })
            this.dataSource.addFeature(circleFeature)
        },

     
// 初始化地图     
     initMap(){      
            let OSM_Layer= new TileLayer({
                // source: new OSM()
                source: new XYZ({
                        url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                        crossOrigin: "anonymous"                    
                })
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
                        projection: "EPSG:3857",
                        center:fromLonLat([16.5, 39.7]) ,
                        zoom: 5
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
        height: 620px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 600px;
        height: 500px;
        border: 1px solid #42B983;
        float: left;
    }
    .nav{float: left; width: 210px; height: 500px; margin-right: 10px; padding-top:10px}
    .nav >>> .el-input-group{ width: 200px; padding: 0 5px;  margin-bottom: 10px;}
</style>

