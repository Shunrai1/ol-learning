/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-21
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 通过hover选择元素，更换样式</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import Select from 'ol/interaction/Select';
	import {getCenter} from 'ol/extent';
	import ImageLayer from 'ol/layer/Image';
	import Projection from 'ol/proj/Projection';
	import Static from 'ol/source/ImageStatic';
	import GeoJSON from 'ol/format/GeoJSON';
	import {Vector as VectorLayer} from 'ol/layer';
	import {Vector as VectorSource} from 'ol/source';
	import {Fill,Stroke,Style,Text,} from 'ol/style';
	
	const extent = [0, 0, 50, 50];
	const projection = new Projection({
		code: 'xkcd-image',
		units: 'pixels',
		extent,
	});
	export default {
		data() {
			return {
				map: {},
			};
		},
		mounted() {
			this.initMap();
		},
		methods: {
			initMap() {
				const getStyles = (param) => {

					const style = new Style({
						stroke: new Stroke({
							color: '#2d9fd8',
							width: 0,
						}),
						fill: new Fill({
							color: '#2d9fd8',
							opacity: 0.2,
						}),
						text: new Text({ // 文本样式
							className: 'map-font',
							font: '14px Microsoft YaHei',
							fill: new Fill({
								color: 'white',
							}),
						}),
					});
					if (param === '2311') {
						style.getStroke().setColor('rgba(255,0,0,0.2)');
						style.getFill().setColor('rgba(20,255,0,0.4)');
					}
					style.getText().setText(param);

					return style;
				};
				const styleFunction = (feature) => getStyles(feature.values_.modelId);
				const geojsonObject = {
					type: 'FeatureCollection',
					crs: {
						type: 'name',
						properties: {
							name: 'EPSG:3857',
						},
					},
					features: [{
							type: 'Feature',
							geometry: {
								type: 'Polygon',
								coordinates: [
									[
										[14.599609375, 16.9677734375],
										[21.6796875, 17.08984375],
										[21.6796875, 4.7607421875],
										[14.84375, 4.7607421875]
									]
								],
							},
							properties: {
								modelId: '2311',
								type: 'room'
							},
						},
						{
							type: 'Feature',
							geometry: {
								type: 'Polygon',
								coordinates: [
									[
										[21.5576171875, 17.08984375],
										[28.6376953125, 17.08984375],
										[28.515625, 5.0048828125],
										[21.5576171875, 5.126953125]
									]
								],
							},
							properties: {
								modelId: '2310',
								type: 'room'
							},
						},
					],
				};

				const vectorSource = new VectorSource({
					features: (new GeoJSON()).readFeatures(geojsonObject),
				});
				const vectorLayer = new VectorLayer({
					source: vectorSource,
					style: styleFunction,
					title: '',
					type: 'room',
				});
				this.map = new Map({
					layers: [
						new ImageLayer({
							source: new Static({
								url: require('@/assets/img/satellite-map.jpg'),
								projection,
								imageExtent: extent,
							}),
						}),
						vectorLayer,
					],
					target: 'vue-openlayers',
					view: new View({
						projection,
						center: getCenter(extent),
						zoom: 1,
						maxZoom: 4,
						minZoom: 1,
					}),
				});
				// 选中之后的样式
				const selectStyle = new Style({
						stroke: new Stroke({
							color: '#2d9fd8',
							width: 1,
						}),
						fill: new Fill({
							color: 'rgba(255,0,0,0.6)',
							opacity: 0.5,
						}),
						text: new Text({ // 文本样式
							className: 'map-font',
							font: '14px Microsoft YaHei',
							fill: new Fill({
								color: 'black',
							}),
						}),
					
				});
				
				let selected = null;
				this.map.on('singleclick', (e)=>{
				  if (selected !== null) {
				    selected.setStyle(undefined);
				    selected = null;
				  }
				
				  this.map.forEachFeatureAtPixel(e.pixel,(f)=>{
				    selected = f;
				    selectStyle.getStroke().setColor(f.get('COLOR') || 'rgba(255,0,0,0.2)');
				    f.setStyle(selectStyle);
					console.log(f.get('modelId'));
					
						this.$message({
							type: 'error',
							message:f.get('modelId')
						})

				  });
				})

			},
		},
	};
</script>

<style scoped>
    .container {
        width: 840px;
        height: 590px;
        margin: 5px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 470px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>



