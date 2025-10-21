
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-11
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 选择左右两部分的地图，不重复，横向卷帘</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            L:  <el-select v-model="value1" multiple placeholder="请选择" size="mini" @change="changeOptions(1)">
                <el-option
                  v-for="item in options"
                  :key="item.value"
				  :disabled="item.selLeft==2"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
			  
			R:  <el-select v-model="value2" multiple placeholder="请选择" size="mini" @change="changeOptions(2)">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
				  :disabled="item.selLeft==1"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>  
            <el-button type="primary" size="mini" @click="startSwipe()">开启卷帘</el-button>
            <el-button type="danger" size="mini" @click="endSwipe()">关闭卷帘</el-button>
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import TileLayer from 'ol/layer/Tile';
    import View from 'ol/View';
    import XYZ from 'ol/source/XYZ';
    import Stamen from 'ol/source/Stamen';
	    import VectorLayer from 'ol/layer/Vector'
	    import VectorSource from 'ol/source/Vector'
		    import {Point, LineString, Circle, Polygon} from "ol/geom"
			import Feature from 'ol/Feature'
		    import Style from 'ol/style/Style'
		    import Fill from 'ol/style/Fill'
		    import Stroke from 'ol/style/Stroke'
    import {fromLonLat} from 'ol/proj';
    import Swipe from '@/assets/js/Swipe.js'
	import GroupLayer from 'ol/layer/Group'
    export default {
        data() {
            return {
                map: null,
                Map1: null,
                Map2: null,
				Map3: null,
				Map4: null,
				dataSource3: new VectorSource({ wrapX: false }), 
				dataSource4: new VectorSource({ wrapX: false }), 
                swipeControl: null,
				options: [{
				  value: '0',
				  label: 'Map1',
				  selLeft:0,
				}, {
				  value: '1',
				  label: 'Map2',
				  selLeft:0,
				}, {
				  value: '2',
				  label: 'Map3',
				  selLeft:0,
				}, {
				  value: '3',
				  label: 'Map4',
				  selLeft:0,
				}],
				value1: [],
				value2: [],
				polygonData:[[ 
						[116.005, 39.005],
						[116.006, 39.008],
						[116.008, 39.008],
						[116.005, 39.005]
				]],
				circleData:{ circleCenter:[115.992, 39],circleRadius:0.005}, 
            };
        },

        methods: {
			        showCircle(){
			            let circleFeature= new Feature({
			                geometry: new Circle(this.circleData.circleCenter,this.circleData.circleRadius),                
			            })
			            this.dataSource3.addFeature(circleFeature)
			        },      
			        // 显示多边形
			        showPolygon(){
			            let polygonFeature= new Feature({
			                geometry: new Polygon(this.polygonData),                
			            })
			            this.dataSource4.addFeature(polygonFeature)
			        },
			
			
			
			changeOptions(x){
				if(x==1){
						for(let i=0;i<this.options.length;i++){
							let flag=0
							for(let j=0;j<this.value1.length;j++){
								if(this.options[i].value==this.value1[j]){
									flag++							    
								}							
							}
							
							if(flag){
								this.$set(this.options[i], "selLeft", 1);
							}else if(this.options[i].selLeft==2){
								console.log('不变')
							}else{
								this.$set(this.options[i], "selLeft", 0);
							}
					}
				}
				if(x==2){
						for(let i=0;i<this.options.length;i++){
							let flag=0
							for(let j=0;j<this.value2.length;j++){
								if(this.options[i].value==this.value2[j]){
									flag++							    
								}							
							}							
							if(flag){
								this.$set(this.options[i], "selLeft", 2);
							}else if(this.options[i].selLeft==1){
								console.log('不变')
							}else{
								this.$set(this.options[i], "selLeft", 0);
							}
					}
				}
			},
			

            startSwipe(){

				if(this.value1.length!=0&&this.value2.length!=0){
					
					this.swipeControl = new Swipe({
					    className: 'abc',
					});
					this.map.addControl(this.swipeControl);
				
					for(let i=0;i<this.options.length;i++){
						let mapType=this.options[i].label
						if(this.options[i].selLeft==1){
						   this.swipeControl.addLayer(this[`${mapType}`]); // 左侧	
						    this[`${mapType}`].setVisible(true);
						}
						if(this.options[i].selLeft==2){
						   this.swipeControl.addLayer(this[`${mapType}`],true); // 左侧	
						   this[`${mapType}`].setVisible(true);
						}
						if(this.options[i].selLeft==0){
						    this[`${mapType}`].setVisible(false);
						}
					}
				}else{
					this.$message.error('请选择卷帘的左右两部分地图')
				}

            },

            endSwipe(){
                if(this.swipeControl!= null){
                    this.map.removeControl(this.swipeControl)
                } 
            },

            initMap() {
                this.Map1 = new TileLayer({
					visible:true,
                    source: new XYZ({
                       url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                    })
                })
                this.Map2 = new TileLayer({
					visible:false,
                    source: new Stamen({
                        layer: "watercolor",
                    })
                });
				
				 this.Map3=new VectorLayer({
					 visible:false,
					 source:this.dataSource3,
				 });
				 this.Map4=new VectorLayer({
					 visible:false,
					 source:this.dataSource4,
				 });				
				
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        this.Map1,
                        this.Map2,
                        this.Map3,
                        this.Map4,						
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [116.005, 39.005],
                        zoom: 14
                    }),
                });
            },
        },
        mounted() {
            this.initMap();
			this.showCircle();
			this.showPolygon(); 
        }
    }
</script>
<style>
    .container {
        width: 840px;
        height: 640px;
        margin: 20px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 470px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }

    .abc {
        background: transparent;
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 64px;
        height: 64px;
    }
    .abc:hover{background-color:transparent}
    .abc button {
        background: url('../assets/img/arrow12.png') left top no-repeat;
        background-size:64px 64px;
        width: 64px;
        height: 64px;
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: ew-resize;
        outline: 0px solid #ddd;
    }

    .abc button:hover {
        outline: 0px solid #000000 !important;
		background-color:transparent;
    }

    .abc button:focus {
        outline: 0px solid #000000 !important;
    }

    .abc .leftSwipeClass {
        position: absolute;
        top: 90%;
        left: 0;
        width: 235px;
        padding-right:15px;
        text-align: right;
        font-size: 20px;
        color: #ff0000
    }

    .abc .rightSwipeClass {
        position: absolute;
        top: 90%;
        right: 0;
        width: 235px;
        padding-left:15px;
        text-align: left;
        font-size: 20px;
        color: #FF0000
    }
	.abc .lineClass{
		position: absolute;
		background-color:rgba(255,0,255,0.9);
		width: 1px;
		height: 2000px;
		top: -1000px;
		left:50%;
	}
</style>

