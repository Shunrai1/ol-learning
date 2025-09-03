/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-16
*/

<template>
    <div class="container">
        <h3>vue+openlayers:加载显示热力图一（使用geojson数据） </h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import VectorSource from 'ol/source/Vector'
    import VectorLayer from 'ol/layer/Vector'
    import Tile from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM'
    import HeatmapLayer from 'ol/layer/Heatmap'
    import GeoJSON from 'ol/format/GeoJSON'

    export default {
        name: 'Heatmap',
        data() {
            return {
                map: null,
                source: new VectorSource({
                    wrapX: false,
                }),
				heatmapData: {
				  type: 'FeatureCollection',
				  features: [
				    {
				      type: 'Point',
				      coordinates: [116.40182752977934, 39.92476619935702],
				      count: 100,
				    },
				    {
				      type: 'Point',
				      coordinates: [116.42764915596571, 39.949683921105375],
				      count: 200,
				    },
				    {
				      type: 'Point',
				      coordinates: [116.48107607733336, 39.88376327014636],
				      count: 300,
				    },
				    {
				      type: 'Point',
				      coordinates: [116.43154238235083, 39.94546346522044],
				      count: 400,
				    },
				    {
				      type: 'Point',
				      coordinates: [116.40311901342001, 39.92316223836612],
				      count: 500,
				    },
				  ],
				},

            }
        },
        methods: {
			
			addHeatmap() {
			  let heatMapLayer = new HeatmapLayer({
				source: new VectorSource({
				  features: new GeoJSON().readFeatures(this.heatmapData),
				}),
				zIndex: 9,
				opacity: 0.5,
				name: '热力图',
				blur: 20, // 模糊尺寸
				radius: 20, // 热点半径
			  })
			  this.map.addLayer(heatMapLayer)
			},

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM()
                        })
                    ],
                    view: new View({
					projection: 'EPSG:4326',
					center: [116.395645038, 39.9299857781],
					zoom: 12,
                    })
                })

            }
        },
        mounted() {
            this.initMap()
			this.addHeatmap()
        }
    }
</script>

<style scoped>
    .container {
        width: 840px;
        height: 520px;
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
