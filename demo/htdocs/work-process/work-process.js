$(function () {

    if (!window.getI18NString) {
        getI18NString = function (s) {
            return s;
        }
    }

    var graph = new Q.Graph('canvas');
    graph.enableTooltip = true;

    function onDataCollected(txt) {
        var json = JSON.parse(txt);
        translateToQuneeElements(json, graph);
    }

    var HierarchicLayouter = function (graph) {
        this.graph = graph;
    }

    HierarchicLayouter.prototype = {
        getLayoutResult: function (params) {
            if (!(params instanceof Object)) {
                if (Q.isNumber(params)) {
                    params = {xGap: params, yGap: params}
                } else {
                    params = {};
                }
            }
            var xGap = params.xGap || 200;
            var yGap = params.yGap || 260;
            var graph = this.graph;

            var locations = {};
            graph.graphModel.forEachByTopoDepthFirstSearch(function (v, from, layer, index, sum) {
                if (v._layer === undefined) {
                    if (!v.pid) {
                        v._layer = layer;
                    } else {
                        v._layer = v.parent._layer;
                    }
                }
            });

            var layers = {};
            graph.forEach(function (element) {
                var nodes = layers[element._layer];
                if (!nodes) {
                    nodes = layers[element._layer] = [];
                }
                nodes.push(element);
            })

            var layer = 0;
            while (true) {
                var nodes = layers[layer];
                if (!nodes) {
                    break;
                }
                var width = (nodes.length - 1) * xGap;
                var x = -width / 2;
                var y = layer * yGap;
                nodes.forEach(function (node, i) {
                    if (node.$name != "mapi" && node.$name != "console") {
                        locations[node.id] = {node: node, x: x + i * xGap, y: y};
                    } else if (node.$name == "mapi") {
                        var obj = {}, p = locations[node.pid];
                        $.extend(true, obj, p) && (locations[node.id] = {
                            node: node,
                            x: obj.x - 30,
                            y: obj.y - 30
                        });
                    } else {
                        var obj = {};
                        obj = $.extend(true, obj, locations[node.pid]);
                        locations[node.id] = {
                            node: node,
                            x: obj.x + 30,
                            y: obj.y + 30
                        };
                    }
                    delete node._layer;
                })
                layer++;
            }
            return locations;
        }
    }

    Q.extend(HierarchicLayouter, Q.Layouter);

    function translateToQuneeElements(json, graph) {
        var map = {};
        if (json.datas) {
            Q.forEach(json.datas, function (data) {
                // var name = data.json.name;
                var node = graph.createText(data.json.name);
                node.setStyle(Q.Styles.LABEL_BORDER, 1);
                node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFF");
                node.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
                node.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
                node.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(180, 80));
                node.setStyle(Q.Styles.LABEL_ALIGN_POSITION, Q.Position.CENTER_TOP);
                node.visible = true;
                // node.tooltip = name && name.substring(0, 1);

                var mapi = graph.createText("mapi");
                mapi.visible = true;
                mapi.anchorPosition = Q.Position.RIGHT_MIDDLE;
                mapi.setStyle(Q.Styles.LABEL_SIZE, {width: 60});

                var console = graph.createText("console");
                console.visible = true;
                console.anchorPosition = Q.Position.LEFT_MIDDLE;
                console.setStyle(Q.Styles.LABEL_SIZE, {width: 60});

                mapi.parent = mapi.host = node;
                console.parent = console.host = node;

                mapi.pid = console.pid = node.id;

                map[data._refId] = node;
            });
        }
        if (json.edges) {
            Q.forEach(json.edges, function (data) {
                var from = map[data.json.from._ref];
                var to = map[data.json.to._ref];
                if (!from || !to) {
                    return;
                }
                to.parent = to.host = from;
                console.log(to.name + " ---> " + from.name);
                var edge = graph.createEdge(data.name || '', from, to);
                if (from.id == 171 && to.id == 213) {
                    // edge.addPathSegment([200, 100]);
                    // edge.addPathSegment([200, 100]);
                    // edge.edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
                }
                edge.setStyle(Q.Styles.EDGE_LINE_DASH, [5, 5]);
                edge.setStyle(Q.Styles.ARROW_TO, false);

                // edge.setStyle(Q.Styles.EDGE_BUNDLE_GAP, 20);
                // edge.setStyle(Q.Styles.EDGE_BUNDLE_LABEL_BACKGROUND_COLOR, "#2898E0");
                // edge.setStyle(Q.Styles.EDGE_BUNDLE_LABEL_PADDING, 3);

                edge.set("data", data);
            }, graph);
        }

        var layouter = new HierarchicLayouter(graph);
        layouter.doLayout({
            byAnimate: true,
            callback: function () {
                graph.moveToCenter();
            }
        });
    }


    graph.visibleFilter = function (node) {
        return node.visible !== false;
    }

    graph.onclick = function (evt) {
        var node = evt.getData();
        if (node) {
            node.edgeCount && node.forEachEdge(function (item, i) {
                    if (item.from.id == node.id) {
                        item.to.visible = !item.to.visible;

                        function checkChildren() {
                            var visible = this.visible !== false;
                            this.forEachChild(function (child) {
                                child.visible = visible;
                                child.invalidateVisibility();
                                checkChildren.call(child);
                            })
                        }

                        checkChildren.call(item.to);
                        item.to.invalidateVisibility();
                    }
                }
            )
            graph.invalidate();
        }
    }


    var onError = function (err) {

    };

    request('./data-server.json', '', onDataCollected, onError)


});

function request(url, params, callback, callbackError) {
    try {
        var req = new XMLHttpRequest();
        req.open('GET', encodeURI(url));
        req.onreadystatechange = function (e) {
            if (req.readyState != 4) {
                return;
            }
            if (200 == req.status) {
                var code = req.responseText;
                if (code && callback) {
                    callback(req.responseText);
                }
                return;
            } else {
                if (callbackError) {
                    callbackError();
                }
            }
        }
        req.send(params);
    } catch (error) {
        if (callbackError) {
            callbackError();
        }
    }
}