/* * @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN） *
@此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com * @First published in xiaozhuanlan.com * @Second
published in CSDN * @First published time: 2022-10-19 */

<template>
  <div class="container">
    <h3>
      vue+openlayers:
      多边形拐点用RegularShape表示（三角形、矩形、正方形、星形...）
    </h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="drawPolygon()"
        >绘制多边形</el-button
      >
      <el-button type="primary" size="mini" @click="clear()"
        >清除图形</el-button
      >
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import Feature from "ol/Feature";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import RegularShape from "ol/style/RegularShape";
import Draw from "ol/interaction/Draw";
import MultiPoint from "ol/geom/MultiPoint";

export default {
  name: "RegularShape",
  data() {
    return {
      map: null,
      osmLayer: null,
      draw: null,
      source: new SourceVector({ wrapX: false }),
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    clear() {
      this.source.clear();
    },
    drawPolygon() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw);
      }
      let type = "Polygon";
      this.draw = new Draw({
        source: this.source,
        type,
      });
      this.map.addInteraction(this.draw);
    },

    initMap() {
      this.osmLayer = new TileLayer({
        source: new OSM(),
      });
      let drawLayer = new LayerVector({
        source: this.source,
        style: [
          new Style({
            fill: new Fill({
              color: "transparent",
            }),
            stroke: new Stroke({
              width: 2,
              color: "blue",
            }),
          }),
          new Style({
            image: new RegularShape({
              points: 4,
              radius: 10,
              angle: Math.PI / 4,
              fill: new Fill({
                color: "red",
              }),
              stroke: new Stroke({
                color: "orange",
                width: 2,
              }),
            }),
            geometry: function (feature) {
              var coordinates = feature.getGeometry().getCoordinates()[0];
              return new MultiPoint(coordinates);
            },
          }),
        ],
      });

      this.map = new Map({
        layers: [this.osmLayer, drawLayer],
        view: new View({
          center: [118, 39.5],
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
}
</style>

<!-- 其他形状代码参考 -->
<!-- const styles = {
  'square': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      angle: Math.PI / 4,
    }),
  }),
  'rectangle': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      radius: 10 / Math.SQRT2,
      radius2: 10,
      points: 4,
      angle: 0,
      scale: [1, 0.5],
    }),
  }),
  'triangle': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 3,
      radius: 10,
      rotation: Math.PI / 4,
      angle: 0,
    }),
  }),
  'star': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 5,
      radius: 10,
      radius2: 4,
      angle: 0,
    }),
  }),
  'cross': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      radius2: 0,
      angle: 0,
    }),
  }),
  'x': new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      radius2: 0,
      angle: Math.PI / 4,
    }),
  }),
  'stacked': [
    new Style({
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 5,
        angle: Math.PI / 4,
        displacement: [0, 10],
      }),
    }),
    new Style({
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 10,
        angle: Math.PI / 4,
      }),
    }),
  ],
}; -->
