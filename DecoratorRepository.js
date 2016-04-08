var XpathHelper = {
    getSnapshots: function(xpath, source){
        return document.evaluate(xpath, source, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    }
};

function processRequests(data) {
    GM_xmlhttpRequest({
        method: "GET",
        url: data.url,
        headers: {"Accept": "application/json"},
        // synchronous: true,
        // synchronous: false,
        onload: function(response) {
            data.callback(response);
        }
    });
}

function appendData(htmlNode, data){
    var newNode = document.createElement("div");
    newNode.appendChild(data);

    htmlNode.parentNode.insertBefore(newNode, htmlNode.nextSibling);
}

var DecoratorRepository = {
        decorators: [
            {
                type: "Movie",
                elements: [
                    {
                        name: "IMDB",
                        functions: [
                            {
                                description: "Puntaje de IMDb" ,
                                method : function (htmlNode){
                                    var actionFunction = function(jsonResponse){
                                        appendData(htmlNode, document.createTextNode("Puntaje IMDB: "+jsonResponse.imdbRating));
                                    }

                                    var xpath = htmlNode.conceptProperties[1].xpath;
                                    var htmlObjects = XpathHelper.getSnapshots(xpath, htmlNode);
                                    var title = htmlObjects.snapshotItem(0).data;

                                    processRequests(this.findImdbId(title, actionFunction));
                                },
                                selectedText: function (textSelection){
                                    var appendToSelectedText = function(jsonResponse){
                                        var span = document.createElement("span");
                                        span.textContent = "("+jsonResponse.imdbRating+")";

                                        newTextNode = textSelection.focusNode.splitText(textSelection.focusOffset);
                                        newTextNode.parentElement.insertBefore(span, newTextNode)
                                    }

                                    processRequests( this.findImdbId(textSelection.text, appendToSelectedText) );
                                },
                                findImdbId: function(title, callbackDecorator){
                                    var getImdbData = function(movieID){
                                        return {
                                            url: 'http://www.omdbapi.com/?i='+movieID+'&plot=short&r=json',
                                            callback: function(response){
                                                var jsonResponse = JSON.parse(response.responseText);

                                                callbackDecorator(jsonResponse);
                                            }
                                        }
                                    }
                                    return {
                                        url: 'http://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q='+title,
                                        callback: function (response) {
                                            // Obetner el ID con XPath
                                            var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                                            var resultsIDs = responseXML.evaluate('//td[@class="result_text"]/a/@href', responseXML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                                            var movieID = resultsIDs.snapshotItem(0).value.substring(7,16);

                                            processRequests(getImdbData(movieID));
                                        }
                                    }
                                }
                            },
                            {
                                description: "Actores",
                                method : function (htmlNode){
                                    var actionFunction = function(jsonResponse){
                                        appendData(htmlNode, document.createTextNode("Actores: "+jsonResponse.Actors));
                                    }

                                    var xpath = htmlNode.conceptProperties[1].xpath;
                                    var htmlObjects = XpathHelper.getSnapshots(xpath, htmlNode);
                                    var title = htmlObjects.snapshotItem(0).data;

                                    processRequests(this.findImdbId(title, actionFunction));
                                },
                                selectedText: function (aText){
                                    processRequests(findImdbId(aText, {}));
                                },
                                findImdbId: function(title, callbackDecorator){
                                    var getImdbData = function(movieID){
                                        return {
                                            url: 'http://www.omdbapi.com/?i='+movieID+'&plot=short&r=json',
                                            callback: function(response){
                                                var jsonResponse = JSON.parse(response.responseText);

                                                callbackDecorator(jsonResponse);
                                            }
                                        }
                                    }
                                    return {
                                        url: 'http://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q='+title,
                                        callback: function (response) {
                                            // Obetner el ID con XPath
                                            var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                                            var resultsIDs = responseXML.evaluate('//td[@class="result_text"]/a/@href', responseXML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                                            var movieID = resultsIDs.snapshotItem(0).value.substring(7,16);

                                            processRequests(getImdbData(movieID));
                                        }
                                    }
                                }
                            },
                            {
                                description: "Título Internacional",
                                method : function imdbInternationalTitle(htmlNode){
                                    var actionFunction = function(jsonResponse){
                                        appendData(htmlNode, document.createTextNode("Título Internacional: "+jsonResponse.Title));
                                    }

                                    var xpath = htmlNode.conceptProperties[1].xpath;
                                    var htmlObjects = XpathHelper.getSnapshots(xpath, htmlNode);
                                    var title = htmlObjects.snapshotItem(0).data;

                                    processRequests(this.findImdbId(title, actionFunction));
                                },
                                selectedText: function (aText){
                                    processRequests(this.findImdbId(aText, {}));
                                },
                                findImdbId: function(title, callbackDecorator){
                                    var getImdbData = function(movieID){
                                        return {
                                            url: 'http://www.omdbapi.com/?i='+movieID+'&plot=short&r=json',
                                            callback: function(response){
                                                var jsonResponse = JSON.parse(response.responseText);

                                                callbackDecorator(jsonResponse);
                                            }
                                        }
                                    }
                                    return {
                                        url: 'http://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q='+title,
                                        callback: function (response) {
                                            // Obetner el ID con XPath
                                            var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                                            var resultsIDs = responseXML.evaluate('//td[@class="result_text"]/a/@href', responseXML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                                            var movieID = resultsIDs.snapshotItem(0).value.substring(7,16);

                                            processRequests(getImdbData(movieID));
                                        }
                                    }
                                }
                            }
                        ],
                        applyTo: function(guiManager, htmlNode){
                            guiManager.drawSubmenu(this, htmlNode);
                        }
                    },
                    {
                        name: "Trailer Addict",
                        functions: [
                            {
                                description: "Buscar Video",
                                method : function (htmlNode){
                                    var decoratePageConcept = function(newNode){
                                        appendData(htmlNode, newNode);
                                    }

                                    var xpath = htmlNode.conceptProperties[1].xpath;
                                    var htmlObjects = XpathHelper.getSnapshots(xpath, htmlNode);
                                    var title = htmlObjects.snapshotItem(0).data;

                                    processRequests(this.findImdbId(title, decoratePageConcept));
                                },
                                selectedText: function (aText){
                                    processRequests(this.findImdbId(aText, callbackDecorator));
                                },
                                findImdbId: function(title, callbackDecorator){
                                    var getTrailer = function(movieID){
                                        return {
                                            url: 'http://api.traileraddict.com/?imdb='+movieID.slice(2),
                                            callback: function(response){
                                                var regex = /v.traileraddict.com\/(\d*)/;
                                                var regexResult = regex.exec(response.responseText);
                                                var trailerId = regexResult[1];

                                                var newNode = document.createElement("iframe");
                                                newNode.setAttribute("src", "http://v.traileraddict.com/"+trailerId);
                                                newNode.setAttribute("height", "270");
                                                newNode.setAttribute("width", "480");

                                                callbackDecorator(newNode);
                                            }
                                        }
                                    }

                                    return {
                                        url: 'http://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q='+title,
                                        callback: function (response) {
                                            // Obetner el ID con XPath
                                            var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                                            var resultsIDs = responseXML.evaluate('//td[@class="result_text"]/a/@href', responseXML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                                            var movieID = resultsIDs.snapshotItem(0).value.substring(7,16);

                                            processRequests(getTrailer(movieID));
                                        }
                                    }
                                },
                                
                            }
                        ]
                    }
                ]
            }
        ],
        getDecoratorsForConcept: function (aConcept) {
            for (var i = this.decorators.length - 1; i >= 0; i--) {
                if (this.decorators[i].type == aConcept.name) {
                    return this.decorators[i].elements;
                }
            }
        },
        getAllDecorators: function () {
            return this.decorators;
        }
    };