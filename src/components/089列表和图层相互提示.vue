
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-07
*/

<template>
    <div class="container">
        <h3>列表与图层互相提示信息功能</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
		<h4> 
			<span v-for="(item,index) in list" :key="index" style="margin-top: 10px; margin:0 10px;">
				<el-link :type="item.show? 'primary': 'danger'" @mouseover.native="showTip(index,item.area)" @mouseleave.native="closeTip(index)">
					{{item.descName}}</el-link>   
			</span>
		</h4>
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
	import Feature from 'ol/Feature'
	import {Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
 
export default {
  data() {
    return {
        map:null,
		tipSource: new VectorSource({ wrapX: false }), 
		list: [{
				layerName: 'moni1',
				descName: "模拟区块1",
				show: true,
				area: [[139.6485790340825,35.27194604343114],[139.6769740340825,35.27194604343114],[139.6769740340825,35.29464604343114],[139.6485790340825,35.29464604343114],[139.6485790340825,35.27194604343114]]
			},
			{
				layerName: 'moni2',
				descName: "模拟板块2",
				show: true,
				area: [[139.6485790340825,35.26013604343114],[139.6769740340825,35.26013604343114],[139.6769740340825,35.27294604343114],[139.6485790340825,35.27294604343114],[139.6485790340825,35.26013604343114]]
			},

		],
		
    };
  },
  
  methods:{

    // 关闭列表提示	
        closeTip(x){
		   this.tipSource.clear();	
		   this.list[x].show!=this.list[x].show
		},
	// 开启列表提示	
		showTip(x, y) {
			this.list[x].show = !this.list[x].show;
			this.showTipLayer(x)
		},
	// 构建提示层		
        showTipLayer(i){			      
			    this.tipSource.clear(); 
				const tipFeature = new Feature({
				geometry: new Polygon([this.list[i].area]),
				});				
				const tipStyle = new Style({
					// rotation: 15,
					stroke: new Stroke({
						color: '#f00',
						width: 3
					}),
					fill: new Fill({
						color: "rgba(255,0,0,0.1)"
					})
				});
				tipFeature.setStyle(tipStyle);		
                this.tipSource.addFeature(tipFeature); 								
		},	
// 添加feature层	
		addVecterLayers() {
			    let features = [];
				for (let i = 0; i < this.list.length; i++) {
					const iconFeature = new Feature({
						geometry: new Polygon([this.list[i].area]),
						name: this.list[i].layerName,
						listindex: i,
					});
					const iconStyle = new Style({
						stroke: new Stroke({
							color: '#409eff',
							width: 2
						}),
						fill: new Fill({
							color: "rgba(255,0,0,0.1)"
						})
					});
					iconFeature.setStyle(iconStyle);
					features.push(iconFeature)
					}
					
					const vectorSource = new VectorSource({
						features: features,
					});

					const vectorLayer1 = new VectorLayer({
						source: vectorSource,
						zIndex: 3,
					});
					this.map.addLayer(vectorLayer1)
				

			},

// hover feature层，显示列表中对应信息
			hoverFeature() {
				this.map.on("pointermove", e => {
					if (e.dragging) {
						return;
					}
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
				// 更改鼠标样式	
					  if(feature==undefined){
						this.map.getTargetElement().style.cursor="auto"
					  }else{
						this.map.getTargetElement().style.cursor="pointer"
					  }

					if (feature) {
						 let i=feature.get("listindex")
		                 for (let j = 0; j < this.list.length; j++) {
		                 	if (j == i) {
		                 		this.list[j].show = false;
		                 	} else {
		                 		this.list[j].show = true;
		                 	}
		                 }

					} else {
						for (let j = 0; j < this.list.length; j++) {
								this.list[j].show = true;
						}
						
					}
				})
			},

	 
// 初始化地图	 
	 initMap(){		 
	        let OSM_Layer= new TileLayer({
	 		    source: new OSM()
	 		})	 
			let tipLayer = new VectorLayer({      //轨迹层
				  source: this.tipSource,
				  zIndex: 10000,
			});	
		 
	 		this.map= new Map({
	 		        target: "vue-openlayers",
	 		        layers: [
                        OSM_Layer,
						tipLayer
	 		        ],
					view: new View({
						projection: "EPSG:4326",
						center: [139.6485790340825,35.27194604343114],
						zoom: 14
					}),
	 		      })
			
			 this.addVecterLayers();	
			 this.hoverFeature();
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

