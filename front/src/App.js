import './App.css';
import axios from 'axios';
import React, { Component } from 'react';
import G6 from '@antv/g6';
import dataJson from './data';

class App extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`)
      .then((res) => res.json())
      .then((json) => this.setState({ data: json }));

    const container = document.getElementById('container');
    const width = container.scrollWidth || 1280;
    const height = window.height || 800;

    const graph = new G6.TreeGraph({
      container: 'container',
      width,
      height,
      linkCenter: true,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              const data = item.get('model');
              data.collapsed = collapsed;
              return true;
            },
          },
          'drag-canvas',
          'zoom-canvas',
          'drag-node',
          'activate-relations',
        ],
      },
      defaultNode: {
        size: 55,
      },
      layout: {
        type: 'dendrogram',
        direction: 'RL',
        nodeSep: 20,
        rankSep: 400,
        radial: true,
      },
    });

    graph.node(function (node) {
      return {
        label: `${node.name.slice(0, 3)}\n${node.name.slice(3)}`,
        size: node.children.length ? 52 : 50,
      };
    });

    graph.data(dataJson);
    graph.render();
    graph.fitView();
    graph.get('canvas').set('localRefresh', false);

    graph.on('node:click', (evt) => {
      const nodeItem = evt.item;
      if (!nodeItem) return;
      const item = nodeItem.getModel();
      if (item.url) {
        window.open(item.url);
      }
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
  }

  render() {
    return (
      <div className="App">
        {this.state.data}
        <h1>GSQL Query: listPatients_Infected_By_2000000205</h1>
        <div id="container"></div>
      </div>
    );
  }
}

export default App;
