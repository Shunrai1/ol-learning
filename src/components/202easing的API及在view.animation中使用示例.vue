
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-14
*/

<template>
    <div class="container">
        <h3>vue+openlayers: easing的API及在view.animation中使用示例</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="animate1([0,0],1500,1)">easeIn</el-button>
            <el-button type="primary" size="mini" @click="animate1([116,39],1500,2)">easeOut</el-button>
			<el-button type="primary" size="mini" @click="animate1([-22,-39],1500,3)">inAndOut</el-button>
			<el-button type="primary" size="mini" @click="animate1([78,36],1500,4)">linear</el-button>
			<el-button type="primary" size="mini" @click="animate1([178,6],1500,5)">upAndDown</el-button>			
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import BingMaps from 'ol/source/BingMaps';
    import {easeIn,easeOut,inAndOut,linear,upAndDown} from 'ol/easing'
	 import * as olEasing from 'ol/easing'
    export default {
        data() {
            return {
                map: null,
            }
        },
        methods: {
            
            animate1(x,y,z) {
                let kk= ''
				switch(z){
					case 1: 
					kk= easeIn();
					break;
					case 2:
					kk= easeOut();
					break;
					case 3:
					kk= inAndOut();
					break;
					case 4:
					kk= linear();
					break;
					case 5:
					kk= upAndDown();
					break;
				}
				
                this.map.getView().animate({
                    // anchor: x,
					center:x,
					duration:y,
                    easing: kk // 动画: 传入动画函数，可以只写easeIn，不写easeIn()
                })
            },

            bing() {
                this.map.getLayers().getArray().forEach((layer) => {
                    if (layer) {
                        this.map.removeLayer(layer);
                    }
                });

                let nsource = new BingMaps({
                    key: 'AqQf9nX6PZKkFZOkdOqBOh3vg8xwGV1AYWGqC6EsOoJ0OHSUwm8CN8AhaFpT7mfR',
                    imagerySet: "RoadOnDemand",
                })
                let bingMapLayer = new Tile({
                    source: nsource,
					preload:Infinity
                });
                this.map.addLayer(bingMapLayer);
            },

            initMap() {

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [],
                    view: new View({
                        center: [122, 47],
                        zoom: 4,
                        projection: "EPSG:4326",
                    }),
                    loadTilesWhileAnimating: true,
                })
                this.bing()
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

