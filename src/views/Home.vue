/* * @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN） *
@此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com * @First published in xiaozhuanlan.com * @Second
published in CSDN * @First published time: 2022-10-17 */
<template>
  <div class="container">
    <h3>vue+openlayers: 利用加载的feature，地图filter，做剪切、遮罩处理</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="mapmask()">遮罩</el-button>
      <el-button type="danger" size="mini" @click="mapcrop()">剪切</el-button>
      <el-button type="danger" size="mini" @click="cancel()">取消</el-button>
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import "ol-ext/dist/ol-ext.min.css"; //引用1
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Fill from "ol/style/Fill";
import Mask from "ol-ext/filter/Mask"; //引用2
import Crop from "ol-ext/filter/Crop"; //引用3

export default {
  name: "蒙版图层",
  data() {
    return {
      map: null,
      osmLayer: null,
      mask: null,
      crop: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    //清除遮罩和剪切
    cancel() {
      if (this.mask) {
        this.mask.set("active", false);
      }
      if (this.crop) {
        this.crop.set("active", false);
      }
    },
    mapcrop() {
      this.cancel();
      let f = new GeoJSON().readFeature(
        require("../assets/data/json/liaoning_province.json").features[0]
      );
      this.crop = new Crop({
        feature: f,
        wrapX: true,
        inner: false,
      });

      this.osmLayer.addFilter(this.crop);
    },
    mapmask() {
      this.cancel();
      let f = new GeoJSON().readFeature(
        require("../assets/data/json/liaoning_province.json").features[0]
      );
      this.mask = new Mask({
        feature: f,
        wrapX: true,
        inner: false,
        fill: new Fill({
          color: [0, 0, 0, 0.5],
        }),
      });
      this.osmLayer.addFilter(this.mask);
    },

    initMap() {
      this.osmLayer = new TileLayer({
        source: new OSM(),
      });

      this.map = new Map({
        layers: [this.osmLayer],
        view: new View({
          center: [123.44, 41.78],
          zoom: 8,
          projection: "EPSG:4326",
        }),
        target: "vue-openlayers",
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 840px;
  height: 570px;
  margin: 50px auto;
  border: 1px solid #42b983;
}
#vue-openlayers {
  width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #42b983;
  position: relative;
}
</style>
