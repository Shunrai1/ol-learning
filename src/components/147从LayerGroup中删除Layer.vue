/* * @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN） *
@此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com * @First published in xiaozhuanlan.com * @Second
published in CSDN * @First published time: 2022-10-18 */

<template>
  <div class="container">
    <h3>vue+openlayers: 从LayerGroup中添加删除Layer，显示隐藏图层组</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="add()"
        >添加进GroupLayer</el-button
      >
      <el-button type="primary" size="mini" @click="remove()"
        >从GroupLayer删除</el-button
      >
      <el-button type="warning" size="mini" @click="show()"
        >显示GroupLayer</el-button
      >
      <el-button type="warning" size="mini" @click="hide()"
        >隐藏GroupLayer</el-button
      >
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Stamen from "ol/source/Stamen";
import TileLayer from "ol/layer/Tile";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import GroupLayer from "ol/layer/Group";

export default {
  name: "GroupLayer",
  data() {
    return {
      map: null,
      osmLayer: null,
      stamenLayer: null,
      group: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    add() {
      this.group.getLayers().getArray().push(this.stamenLayer);
      this.map.updateSize(); //立即更新地图
    },
    remove() {
      this.group
        .getLayers()
        .getArray()
        .forEach((layer, index, array) => {
          if (layer.get("myname") == "abc") {
            this.group.getLayers().getArray().splice(index, 1);
          }
        });
      //异步更新地图 也可以用立即更新地图，如果是弹窗，使用异步
      setTimeout(() => {
        this.map.updateSize();
      }, 100);
    },
    show() {
      this.group.setVisible(true);
    },
    hide() {
      this.group.setVisible(false);
    },

    initMap() {
      this.stamenLayer = new TileLayer({
        source: new Stamen({
          layer: "watercolor",
        }),
        opacity: 0.5,
        myname: "abc",
      });

      this.osmLayer = new TileLayer({
        source: new OSM(),
      });

      this.group = new GroupLayer({
        layers: [this.osmLayer],
        visible: true,
      });

      this.map = new Map({
        layers: [this.group],
        view: new View({
          center: [116, 39.5],
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
