
<template>
    <div class="container">
        <h3>vue+openlayers：点击某feature，列表滑动，定位到相应的点的列表位置</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div class="list">

            <div v-for="(item,index) in list" :key="index" style="margin-top: 10px; margin:0 10px;"
             :id="'pos'+index">
                <div>
                    <el-link :type="item.show? 'infor': 'primary'">
                        {{item.descName}}
                    </el-link>
                </div>
            </div>
        </div>
		
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import XYZ from 'ol/source/XYZ'
    import Feature from 'ol/Feature'
    import {Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Text from 'ol/style/Text'
    import Stroke from 'ol/style/Stroke'
    import {Draw,Modify,Select,Snap} from 'ol/interaction';
    import GeoJSON from 'ol/format/GeoJSON'
    import fData from '@/assets/data/json/liaoning_province.json'

    export default {
        data() {
            return {
                map: null,
                source: new VectorSource({
                    wrapX: false
                }),
                select:null,
                list: [],
                drawfeatures: [],
            };
        },

        methods: {  
			
           //加载geojson数据
            initload(){
                this.drawfeatures= new GeoJSON().readFeatures(fData, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: "EPSG:4326"
                    }),
                this.updateList();
                this.showPolygons() 
            },

         //更新列表
            updateList() {
                this.list = JSON.parse(JSON.stringify([]))
                this.drawfeatures.forEach((feature, index) => {
                    let g = feature.getGeometry();
                    let name = '围栏 ' + index;
                    let one = {
                        descName: name,
                        show: true,
                        area: g
                    };
                    this.list.push(one)
                })
            },

            // 显示多边形  
            showPolygons() {
                let features = [];
                for (let i = 0; i < this.list.length; i++) {
                    const iconFeature = new Feature({
                        geometry: this.list[i].area,
                        listindex: i,
                        name: this.list[i].descName,
                    });

                    features.push(iconFeature)
                }
                this.source.addFeatures(features)
            },

            // 点击 feature层，显示列表中对应信息
            clickFeature() {
                this.map.on("click", e => {
                    let feature = this.map.forEachFeatureAtPixel(
                        e.pixel,
                        (feature, layer) => {
                            return feature
                        }
                    )
                    // 更改鼠标样式   
                    if (feature == undefined) {
                        this.map.getTargetElement().style.cursor = "auto"
                    } else {
                        this.map.getTargetElement().style.cursor = "pointer"
                    }

                    if (feature) {
                        let i =feature.get("listindex")
						window.location.hash='#pos'+i;
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
            initMap() {
                let iconStyle = new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new Fill({
                        color: "rgba(255,0,0,0)"
                    }),
                });

                let google_Layer = new TileLayer({
                    source: new XYZ({
                        url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                        crossOrigin: "anonymous"
                    })
                })
                let drawLayer = new VectorLayer({ //轨迹层
                    source: this.source,
                    style:iconStyle
                });

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        google_Layer,
                        drawLayer,
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [123.4116821, 41.7966156],
                        zoom: 6
                    }),
                })

                this.clickFeature();
				this.select = new Select();
				this.map.addInteraction(this.select);
            },
        },
        mounted() {
            this.initMap();
            this.initload()
        }		
    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 620px;
        height: 460px;
        margin: 0 auto;
        border: 1px solid #42B983;
        float: left;
    }
    .list {
        width: 200px;
        height: 180px;
        margin: 0 auto;
        float: left;
		overflow-y: auto;
    }
</style>

