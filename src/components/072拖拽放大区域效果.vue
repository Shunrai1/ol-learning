/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-11
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 拖拽实现放大区域的效果（DragPan）</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import TileJSON from 'ol/source/TileJSON';
	import {DragPan,DragZoom,defaults as defaultInteractions,} from 'ol/interaction';
    export default {
        data() {
            return {
                map: null,
            }
        },
        methods: {
            maptiler(data) {
                //清除所有layer
                this.map.getLayers().getArray().forEach((layer) => {
                    if (layer) {
                        this.map.removeLayer(layer);
                    }
                });
                let url = 'https://api.maptiler.com/maps/' + data + '/tiles.json?key=RbTrJIUQMw0c6xtn6kZr';
                let source = new TileJSON({
                    url: url,
                    tileSize: 512,
                    crossOrigin: 'anonymous'
                });

                let maptilerMap = new Tile({
                    source: source
                })
                this.map.addLayer(maptilerMap);
            },

            initMap() {
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [],
                    view: new View({
                        center: [13247019.404399557, 4721671.572580107],
                        zoom: 3
                    }),
					interactions: defaultInteractions().extend([new DragPan()]),
                })
            },

        },
        mounted() {
            this.initMap();
            this.maptiler("topographique");
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

