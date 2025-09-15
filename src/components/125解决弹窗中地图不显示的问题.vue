
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-05
*/

<template>
	<div>
		<div class="container">
			<h3>vue+openlayers: 点击按钮，弹窗中的地图不显示的解决办法</h3>
			<p>大剑师兰特, 还是大剑师兰特</p>
				<el-table :data="tabledata"
					:header-cell-style="{ background: '#0F89F6',color: '#fff', padding: '5px 0px',textAlign: 'center',fontSize:'13px'}"
					:cell-style="{ padding: '3px 3px',textAlign: 'center', fontSize:'13px'}" style="width:100%;"
					>
					<el-table-column prop="orderID" label="Order ID" >
					</el-table-column>
					<el-table-column prop="type" label="Type" >
					</el-table-column>
					<el-table-column label="Operations" fixed="right" width="400" >
						<template slot-scope="scope">
							<el-button type="danger" size="mini" @click="onlyTan()">只弹窗不显示地图</el-button>
							<el-button type="success" size="mini" @click="Tan()">弹窗并显示地图</el-button>
						</template>
					</el-table-column>
				</el-table>
		</div>
		<!-- 窗口   -->
		<div class="maskbg" v-show="isProcess">
			<div class="ob">
				<div class="mymap"  id="map"></div>
				<div  @click="close()">关闭弹窗</div>
			</div>
		</div>
	</div>

</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map'
	import View from 'ol/View'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM';
	import dayjs from 'dayjs';
	import {fromLonLat} from 'ol/proj'
	export default {
		name: 'orders',
		data() {
			return {
				map: null,
				osmLayer: new TileLayer({
					source: new OSM(),
				}),
				isProcess: false,
				tabledata: [{
					orderID: '001',
					type: 'cuclife',
				}, ]
			}
		},

		mounted() {
			this.initMap();
		},

		methods: {

			initMap() {
				this.map = new Map({
					target: 'map',
					layers: [this.osmLayer],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([0, 0]),
						zoom: 2
					}),
				})
			},
           
		    // 只弹窗,地图不显示
            onlyTan(){
				this.isProcess = true;
			},
			// 弹窗并显示地图
			Tan() {
				this.isProcess = true;
				// 观察以下为核心代码
				setTimeout(() => {
					this.map.updateSize();
				}, 100);
			},
			close(){
				this.isProcess=false;
			},
		},
	}
</script>

<style scoped>
	
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}	
	.maskbg {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
	}

	.ob {
		width: 840px;
		height: 360px;
		margin: 220px auto 0;
		background: #fff;
		border-radius: 6px 6px 0px 0px;
		position: relative;
	}

	.mymap {
		width: 100%;
		height: 300px;
		margin: 0 auto 20px;
		border: 1px solid #4263EB;
		z-index: 10000;
	}

</style>
