
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-18
*/

<template>
    <div class="container">
       <h3>vue+openlayers：利用swipe插件实现左卷帘功能</h3>
        <p>大剑师兰特，还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
	import 'ol-ext/control/Swipe.css'
    import Map from 'ol/Map';
    import TileLayer from 'ol/layer/Tile';
    import View from 'ol/View';
    import XYZ from 'ol/source/XYZ';
    import Stamen from 'ol/source/Stamen';
    import {fromLonLat} from 'ol/proj';
	import Swipe from 'ol-ext/control/Swipe.js'
    export default {
        data() {
            return {
                map:null,
				StamenMap1:null,
				StamenMap2:null,
            };
        },
        methods: {
			goSwipe(){			
			var ctrl = new Swipe();
			this.map.addControl(ctrl);
			// Set stamen on left
			ctrl.addLayer(this.StamenMap1);
			// OSM on right
			ctrl.addLayer(this.StamenMap2, true);	
			},
            initMap() {
                this.StamenMap1 = new TileLayer({
                    source: new Stamen({
                        layer: "terrain",
                    })
                })
                this.StamenMap2 = new TileLayer({
                    source: new Stamen({
                        layer: "watercolor",
                    })
                });

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        this.StamenMap1,
                        this.StamenMap2,
                    ],
                    view: new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([-116, 39]),
                        zoom: 2
                    }),
                });
            },
        },
        mounted() {
            this.initMap()
			this.goSwipe()
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
        height: 470px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

