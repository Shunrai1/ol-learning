

<template>
    <div class="container">
      <h3>vue+openlayers:动态位置高度角度，模拟卫星地面覆盖区域的大小</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div class="nav">
        <el-input v-model="lon" size="mini"><template slot="prepend">经度</template></el-input>
        <el-input v-model="lat" size="mini"><template slot="prepend">纬度</template></el-input>
        <el-input v-model="alt" size="mini"><template slot="prepend">高度</template></el-input>
        <el-input v-model="pitch" size="mini"><template slot="prepend">俯仰角</template></el-input>
		<el-input v-model="azimuth" size="mini"><template slot="prepend">转向角</template></el-input>
        <el-input v-model="angle" size="mini"><template slot="prepend">天线可视角</template></el-input>
        <el-button type="primary" size="mini"  @click="ellipse()">显示椭圆形</el-button>
        <el-button type="primary" size="mini"  @click="clearLayer()">清除图层</el-button>
        </div>
        <div id="vue-openlayers" ></div>
    </div>
</template>


<script>
    import 'ol/ol.css';
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from 'ol/layer/Tile'
    import VectorSource from 'ol/source/Vector'
    import VectorLayer from 'ol/layer/Vector'
    import XYZ from 'ol/source/XYZ'
    import {transform,fromLonLat,toLonLat} from 'ol/proj';
    import * as turf from '@turf/turf'
    import GeoJSON from 'ol/format/GeoJSON'
	import Feature from 'ol/Feature'
    import {Fill,Stroke,Style,Circle,Icon,Image} from 'ol/style'
    import {Point,LineString,Polygon,MultiPoint,MultiPolygon,MultiLineString} from "ol/geom"
    export default {
        data() {
            return {
                map: null,
                turfSource: new VectorSource({
                    wrapX: false
                }),
				pointSource: new VectorSource({
				    wrapX: false
				}),
				lon:-75,
				lat:40,
				alt: 500000,
				pitch: 45,
				angle:60,
				azimuth:0,
            };
        },

        methods: {
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

			featureStyle2(){
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
							  color: '#ff00ff'
							})
						  }),                
				})
				return style            
			},

            show(geojsonData) {

                let features = new GeoJSON().readFeatures(geojsonData, {
                    dataProjection: 'EPSG:4326', //数据投影格式
                    featureProjection: "EPSG:3857" //feature投影格式
                })
                this.turfSource.addFeatures(features)
            },

            clearLayer() {
                this.turfSource.clear();
            },
			
			getcoord(lon,lat,alt,pitch,azimuth,angle){   //根据参数获取椭圆形位置信息
			   let pp=Math.tan(pitch*Math.PI/180) * alt 
			   let ww=Math.sin(azimuth*Math.PI/180) * pp
			   let hh=Math.cos(azimuth*Math.PI/180) * pp			   
			   let c0c=fromLonLat([lon, lat])
			   let clon=c0c[0]+ww;
			   let clat=c0c[1]+hh; 
   
			   let b=Math.tan((angle/2)*Math.PI/180) * alt 	//椭圆短半径	   
			   let aa=Math.tan((pitch+angle/2)*Math.PI/180) * alt 
			   let ab=Math.tan((pitch-angle/2)*Math.PI/180) * alt 
			   let a=(aa-ab)/2		//椭圆长半径	      
			   let cc=toLonLat([clon, clat])  //返回新中心点
 
               // 绘制新中心点
			   let pointFeature= new Feature({
			   	geometry: new Point([clon, clat]), 
			   	dataProjection: 'EPSG:4326', //数据投影格式
			   	featureProjection: "EPSG:3857" //feature投影格式			   
			   })
			   this.turfSource.addFeature(pointFeature)
				this.map.getView().setCenter([clon, clat])	
						   
				return [cc,a,b] 		   
						   
			},
			
			originPoint(){
				let pointFeature= new Feature({
					geometry: new Point(fromLonLat([-75, 40])), 
					dataProjection: 'EPSG:4326', //数据投影格式
					featureProjection: "EPSG:3857" //feature投影格式			   
				})
				this.pointSource.addFeature(pointFeature)
			},
					
            ellipse() {
				let ppdata=this.getcoord(this.lon,this.lat,this.alt,this.pitch,this.azimuth,this.angle)
                console.log(ppdata)
				var center = ppdata[0];
				var xSemiAxis = ppdata[1]/1000;
				var ySemiAxis = ppdata[2]/1000;
				var ellipse = turf.ellipse(center, xSemiAxis, ySemiAxis,{ angle: Number(this.azimuth) });				
				this.show(ellipse)
            },
            initMap() {
                let gaode_Layer = new TileLayer({
                    source: new XYZ({
                        url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                        crossOrigin: "anonymous"   
                    })
                })
                let turfLayer = new VectorLayer({
                    source: this.turfSource,
					style: this.featureStyle()
                })
				let pointLayer = new VectorLayer({
				    source: this.pointSource,
					style: this.featureStyle2()
				})

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        gaode_Layer,
                        turfLayer,
						pointLayer
                    ],
                    view: new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([-75, 40]),
                        zoom: 6
                    }),
                })

            },
        },
        mounted() {
            this.initMap();
			this.originPoint()
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

