/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-23
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 地图图像的滤镜效果</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="filter1([0, -1, 0, -1, 5, -1, 0, -1, 0])">锐化</el-button>
			<el-button type="primary" size="mini" @click="filter1([1, 1, 1, 1, 1, 1, 1, 1, 1])">模糊</el-button>
			<el-button type="primary" size="mini" @click="filter1([1, 2, 1, 0, 1, 0, -1, -2, -1])">阴影</el-button>
			<el-button type="primary" size="mini" @click="filter1([-2, 1, 0, -1, 1, 1, 0, 1, 2])">浮雕</el-button>
			<el-button type="primary" size="mini" @click="filter1([0, 1, 0, 1, -4, 1, 0, 1, 0])">边缘</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ';
	import {fromLonLat} from 'ol/proj';

	export default {
		data() {
			return {
				map: null,
				czoom: 6,
				filterLayer:null,
				sdata:[],
			}
		},
		methods: {
			
			filter1(arr){
				  this.sdata = this.normalize(arr);
				  this.map.render();
			},
			
				normalize(kernel) {
				  const len = kernel.length;
				  const normal = new Array(len);
				  let i,
					sum = 0;
				  for (i = 0; i < len; ++i) {
					sum += kernel[i];
				  }
				  if (sum <= 0) {
					normal.normalized = false;
					sum = 1;
				  } else {
					normal.normalized = true;
				  }
				  for (i = 0; i < len; ++i) {
					normal[i] = kernel[i] / sum;
				  }
				  return normal;
				},

			convolve(context, kernel) {
				const canvas = context.canvas;
				const width = canvas.width;
				const height = canvas.height;

				const size = Math.sqrt(kernel.length);
				const half = Math.floor(size / 2);

				const inputData = context.getImageData(0, 0, width, height).data;

				const output = context.createImageData(width, height);
				const outputData = output.data;

				for (let pixelY = 0; pixelY < height; ++pixelY) {
					const pixelsAbove = pixelY * width;
					for (let pixelX = 0; pixelX < width; ++pixelX) {
						let r = 0,
							g = 0,
							b = 0,
							a = 0;
						for (let kernelY = 0; kernelY < size; ++kernelY) {
							for (let kernelX = 0; kernelX < size; ++kernelX) {
								const weight = kernel[kernelY * size + kernelX];
								const neighborY = Math.min(
									height - 1,
									Math.max(0, pixelY + kernelY - half)
								);
								const neighborX = Math.min(
									width - 1,
									Math.max(0, pixelX + kernelX - half)
								);
								const inputIndex = (neighborY * width + neighborX) * 4;
								r += inputData[inputIndex] * weight;
								g += inputData[inputIndex + 1] * weight;
								b += inputData[inputIndex + 2] * weight;
								a += inputData[inputIndex + 3] * weight;
							}
						}
						const outputIndex = (pixelsAbove + pixelX) * 4;
						outputData[outputIndex] = r;
						outputData[outputIndex + 1] = g;
						outputData[outputIndex + 2] = b;
						outputData[outputIndex + 3] = kernel.normalized ? a : 255;
					}
				}
				context.putImageData(output, 0, 0);
			},


			initMap() {
				this.filterLayer = new Tile({
					source: new XYZ({
						    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=RbTrJIUQMw0c6xtn6kZr',
						    maxZoom: 20,
						    crossOrigin: '',
							tileSize: 512,
					}),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.filterLayer
					],
					view: new View({
					center: fromLonLat([-120, 50]),
					zoom: 6,
					})
				});
                this.filterLayer.on('postrender', (event)=>{
                  this.convolve(event.context, this.sdata);
                });
			},
		},
		mounted() {
			this.initMap();
			this.filter1([0, 0, 0, 0, 1, 0, 0, 0, 0])
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


