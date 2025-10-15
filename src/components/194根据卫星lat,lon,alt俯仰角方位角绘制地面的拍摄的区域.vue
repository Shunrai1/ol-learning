
 <!-- 引用的这个图片能够很好的诠释各个角度之间的关系。 我们这里出发主体是卫星，里面用的的相当于俯角。 面对地图指向北为方位角的0度，顺时针右转依次数值变大。 在polygonFeature旋转角度的时候， 平面的原点Y轴是朝下（向南的），所以给转角设置了一个负号。 -->

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-09
*/

<template>
    <div class="container">
       <h3>vue+openlayers:根据卫星lat，lon，alt，俯仰角，方位角，推算绘制地面的拍摄的区域</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
		<div class="nav">

		<el-input v-model="lon" size="mini"><template slot="prepend">经度</template></el-input>
		<el-input v-model="lat" size="mini"><template slot="prepend">纬度</template></el-input>
		<el-input v-model="alt" size="mini"><template slot="prepend">高度</template></el-input>
		<el-input v-model="pitch" size="mini"><template slot="prepend">俯仰角</template></el-input>
		<el-input v-model="azimuth" size="mini"><template slot="prepend">转向角</template></el-input>
		<el-input v-model="w" size="mini"><template slot="prepend">拍摄宽</template></el-input>
		<el-input v-model="h" size="mini"><template slot="prepend">拍摄长高</template></el-input>
          <el-button type="primary" size="mini"  @click="showPolygon()">显示多边形</el-button>
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
    import {Point, LineString,  Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Circle from 'ol/style/Circle'
	import {fromLonLat,transform} from 'ol/proj'
	import {getCenter} from 'ol/extent';

export default {
  data() {
    return {
        map:null,
        dataSource: new VectorSource({ wrapX: false }), 
        lon:116.3979471,
        lat:39.9081726,
        alt: 500000,
        pitch: 45,
		w:100000,
		h:20000,
		azimuth:30,
        polygonData:[[ 
                [116.005, 39.005],
                [116.006, 39.008],
                [116.008, 39.008],
                [116.005, 39.005]
        ]],
        circleData:{ circleCenter:[115.992, 39],circleRadius:0.005},            
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
                      image: new Circle({  //点样式
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
		
		getcoord(lon,lat,alt,pitch,w,h,azimuth){
			console.log(azimuth*Math.PI/180)
			let y=Math.tan(pitch*Math.PI/180) * alt 
			let ww=Math.sin(azimuth*Math.PI/180) * y
			let hh=Math.cos(azimuth*Math.PI/180) * y
			
			console.log('y:'+y)
			console.log('ww:'+ww)
			console.log('hh:'+hh)
			
			let c0c=fromLonLat([lon, lat])
			let clon=c0c[0]+ww;
			let clat=c0c[1]+hh;	
				
			console.log('clon:'+clon)
			console.log('clat:'+clat)
				
				
			let rh=h / Math.pow((Math.cos(pitch * Math.PI/180)),2) //真实长高
			let xmin=clon-w/2;
			let xmax=clon+w/2;
			let ymin=clat-rh/2;
			let ymax=clat+rh/2;
			let pdata=[[
						   [xmin,ymin],
						   [xmin,ymax],
						   [xmax,ymax],
						   [xmax,ymin],
						   [xmin,ymin]
			]]
			
			let pointFeature= new Feature({
			    geometry: new Point([clon,clat]),                
			})
			this.dataSource.addFeature(pointFeature)
			return [pdata,clon,clat,c0c]	
		},
   
        // 显示多边形
        showPolygon(){			
			let ppdata=this.getcoord(this.lon,this.lat,this.alt,this.pitch,this.w,this.h,this.azimuth)
            let polygonFeature= new Feature({
                geometry: new Polygon(ppdata[0]),                
            })
			let rad= -this.azimuth * (Math.PI/180)
			polygonFeature.getGeometry().rotate(rad,[ppdata[1],ppdata[2]]);
			// let aa=polygonFeature.getGeometry().transform("EPSG:4326", "EPSG:3857");
            this.dataSource.addFeature(polygonFeature)
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
                        center:fromLonLat([116.5, 39.7]) ,
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
