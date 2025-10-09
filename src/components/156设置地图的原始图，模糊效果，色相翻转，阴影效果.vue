<!-- blur(<length>)   如：blur(100px)  
length：CSS 长度。 给绘图提供一个高斯模糊。

drop-shadow(<offset-x>, <offset-y>, <blur-radius>, <spread-radius>, <color>)  如：drop-shadow(0 0 5px #123)
给绘图提供阴影。 阴影事实上是在图像下面呈现出模糊的，通过对图像的透明遮罩进行偏移绘制出一种特殊的颜色，组合而成的效果。 这个函数接受5个参数：
<offset-x>: 查看 <length> 允许的单位。描述阴影的水平距离。
<offset-y>: 查看 <length> 允许的单位。描述阴影的垂直距离。
<blur-radius>: 数值越大，模糊就越大，从而使阴影范围变得更大颜色变得更浅。不允许为负数。
<spread-radius>: 正数会使阴影扩张变大，负数会使阴影收缩。
<color>: 查看 <color> 允许的关键字和标识符。

hue-rotate(<degree>)  如：hue-rotate(100deg)  
Degree：度数。 对图像进行色彩旋转的处理。当值为0度时，图像没有任何变化。

none
没有使用filter -->


/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-21
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 设置地图的原始图、模糊效果、色相翻转、阴影效果</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='o()'>原始图</el-button>
			<el-button type="primary" size="mini" @click='b()'>模糊</el-button>
			<el-button type="warning" size="mini" @click='h()'>色相翻转</el-button>
			<el-button type="info" size="mini" @click='s()'>阴影</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
			};
		},
		methods: {
			o() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `none`;
				});
				this.map.updateSize();//更新地图
			},
			b() {				
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `blur(5px)`;
				});
				this.map.updateSize();
			},
			s() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `drop-shadow(0 0 5px #000)`;
				});
				this.map.updateSize();
			},
			h() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `hue-rotate(180deg)`;
				});
				this.map.updateSize();
			},
   
			initMap() {
				this.osmLayer = new TileLayer({
					source: new OSM(),
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.osmLayer,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116.648, 39.271],
						zoom: 7
					}),
				})
			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

</style>


