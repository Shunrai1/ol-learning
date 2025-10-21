/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-21
*/
<template>
    <div class="container">
		        <h3>vue+openlayers: 加载本地shp数据，在map上显示图形</h3>
		        <p>大剑师兰特，还是大剑师兰特</p>
        <h4>
           <el-button type="primary" size="mini" @click="loadFile()"> 加载shp文件</el-button>
        </h4>

        <div id="vue-openlayers"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import SourceVector from 'ol/source/Vector'
    import LayerVector from 'ol/layer/Vector'
    import GeoJSON from 'ol/format/GeoJSON'
    import {Tile} from 'ol/layer';
    import XYZ from 'ol/source/XYZ' 
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'
    import Text from 'ol/style/Text'
    import Icon from 'ol/style/Icon'  
	import { fromLonLat }  from 'ol/proj'

    const shapefile = require("shapefile");
    export default {
        name: 'VectorJSON',
        data() {
            return {
                map: null,
                source: new SourceVector({
                    wrapX: false
                }),
                view: new View({
                    projection: "EPSG:3857",
                    center: fromLonLat([119.2275, 36.6185]),
                    zoom: 1
                })
            }
        },
        methods: {

            style() {
                let mystyle = new Style({
                    fill: new Fill({
                        color: "#00f"
                    }),
                    stroke: new Stroke({
                        width: 2,
                        color: "#ff0",
                    }),
                    image: new Circle({ //点样式
                        radius: 5,
                        fill: new Fill({
                            color: '#ff0000'
                        }),
                    text: new Text({
                            font: '12px sans-serif', // 设置字体
                            maxAngle: 30,
                            textAlign: 'right',
                            offsetx: 30, // 设置文字偏移量
                            offsetY: 20,
                            text: "text", // 文字描述
                            fill: new Fill({
                                color: '#666',
                            }),
                        })
                    }),
                });
                return mystyle;
            },

            loadFile(){
				let that=this;
				let shp="data/world.shp";   //本地放在public下的文件
				let dbf="data/world.dbf";  // 注意要包含这个，否则提示错误，这个文件可以搞个很小的，替代即可
				shapefile.open(shp,dbf,{encoding:'utf-8'})
				  .then(source => source.read()
				    .then(function log(result) {
				      if (result.done) return;
				     var feature = new GeoJSON().readFeature(result.value, {
				         dataProjection: 'EPSG:4326',
				         featureProjection: 'EPSG:3857'
				     });
				     feature.setStyle(that.style());
				     that.source.addFeature(feature);
				      return source.read().then(log);
				    }))
				  .catch(error => console.error(error.stack));
			},


            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new XYZ({
				url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
				})
                        }),
                        new LayerVector({
                            source: this.source,
                        }),
                    ],
                    view: this.view
                })

            }
        },
        mounted() {
            this.initMap()
        }
    }
</script>

<style scoped>
    .container {
        width: 840px;
        height: 600px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 430px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>


