if (self.CavalryLogger) { CavalryLogger.start_js(["Ttrf3"]); }

__d("FeedStoryCategory",[],(function(a,b,c,d,e,f){e.exports={UNKNOWN:0,ORGANIC:1,ENGAGEMENT:2,FIXED_POSITION:3,PROMOTION:4,SPONSORED:5,END_OF_FEED_CONTENT:6,FB_STORIES:7}}),null);
__d("FeedImageLoadPerfLogger",["DOMQuery","Event","FeedQuickLogModule","QuickPerformanceLogger","Run","crc32"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g=b("FeedQuickLogModule").IMAGE_LOAD_WWW;function h(a){if(!a||!a.target||!a.target.src)return;a=a.target;var c=a.src;a.complete&&b("QuickPerformanceLogger").markerEnd(g,"SUCCESS",b("crc32")(c));j(a)}function i(a){if(!a||!a.target||!a.target.src)return;a=a.target;var c=a.src;if(!c)return;b("QuickPerformanceLogger").markerEnd(g,"FAIL",b("crc32")(c));j(a)}function j(a){if(!a)return;a.removeEventListener("load",h,!0);a.removeEventListener("error",i,!0)}function k(a){__p&&__p();if(!a||!a.src)return;b("QuickPerformanceLogger").markerStart(g,b("crc32")(a.src));if(a.complete){b("QuickPerformanceLogger").markerEnd(g,"SUCCESS",b("crc32")(a.src));return}a.addEventListener("load",h,!0);a.addEventListener("error",i,!0);b("Run").onLeave(function(){l(a)})}function l(a){if(!a||!a.src)return;if(a.complete)return;b("QuickPerformanceLogger").markerEnd(g,"CANCEL",b("crc32")(a.src));j(a)}a={startMarkers:function(a){if(!a)return;a=b("DOMQuery").scry(a,"img");a.forEach(function(a){k(a)})},cancelMarkers:function(a){if(!a)return;a=b("DOMQuery").scry(a,"img");a.forEach(function(a){l(a)})}};e.exports=a}),null);
__d("AdAllocationIntegrityGapsInfo",["FeedStoryCategory"],(function(a,b,c,d,e,f){__p&&__p();function a(a){"use strict";this.story_category=a,this.dist_to_top=-1,this.dist_to_fixed=-1,this.dist_to_promo=-1,this.dist_to_sponsored=-1,this.dist_to_engagement=-1}a.prototype.setDistToTop=function(a){"use strict";this.dist_to_top=a};a.prototype.setDistIfAbsent=function(a,c){"use strict";__p&&__p();if(c<0||a===b("FeedStoryCategory").UNKNOWN||a===b("FeedStoryCategory").ORGANIC)return;switch(a){case b("FeedStoryCategory").ENGAGEMENT:this.dist_to_engagement=this.$1(c,this.dist_to_engagement);break;case b("FeedStoryCategory").FIXED_POSITION:this.dist_to_fixed=this.$1(c,this.dist_to_fixed);break;case b("FeedStoryCategory").PROMOTION:this.dist_to_promo=this.$1(c,this.dist_to_promo);break;case b("FeedStoryCategory").SPONSORED:this.dist_to_sponsored=this.$1(c,this.dist_to_sponsored);break}};a.prototype.$1=function(a,b){"use strict";return b===-1?a:b};e.exports=a}),null);
__d("AdAllocationIntegrityUtils",["DataAttributeUtils","FeedStoryCategory","collectDataAttributes"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g="data-story_category",h="data-dedupekey",i="ft";a={getFeedStoryCategory:function(a){__p&&__p();var c=b("collectDataAttributes")(a,[i]).ft;a=b("DataAttributeUtils").getDataAttribute(a,g);if(a)switch(a){case"2":return b("FeedStoryCategory").ENGAGEMENT;case"3":return b("FeedStoryCategory").FIXED_POSITION;case"4":return b("FeedStoryCategory").PROMOTION;default:return b("FeedStoryCategory").UNKNOWN}else if(c.ei)return b("FeedStoryCategory").SPONSORED;else return b("FeedStoryCategory").ORGANIC},isGapRuleCategory:function(a){if(a===b("FeedStoryCategory").SPONSORED||a===b("FeedStoryCategory").ENGAGEMENT||a===b("FeedStoryCategory").FIXED_POSITION||a===b("FeedStoryCategory").PROMOTION)return!0;else return!1},getDedupKey:function(a){return b("DataAttributeUtils").getDataAttribute(a,h)}};e.exports=a}),null);
__d("ViewportTrackingHooks",["Base64"],(function(a,b,c,d,e,f){__p&&__p();var g={},h=[];a={registerFeedObject:function(a,c){g[a]=b("Base64").encode(c)},updateVisibleViewportObjects:function(a){var b=[],c=!1;for(var d=0;d<a.length;d++){var e=a[d],f=e.id;while(!(f in g)&&e.firstChild!=undefined&&e.firstChild.id!=undefined&&e.firstChild.id.startsWith("u_"))f=e.firstChild.id,e=e.firstChild;f in g&&(b.push(g[f]),(!(d in h)||h[d]!=g[f])&&(c=!0))}!c&&h.length!=b.length&&(c=!0);c&&(h=b,typeof __EXT__updateVisibleViewportObjects==="function"&&__EXT__updateVisibleViewportObjects(h))}};e.exports=a}),null);
__d("viewportTrackingBuilder",[],(function(a,b,c,d,e,f){"use strict";a=function(a){var b=null;return{factory:a,singleton:function(){b||(b=a.apply(undefined,arguments));return b},clearSingleton:function(){b=null}}};e.exports=a}),null);
__d("ViewportTracking",["cx","invariant","AdAllocationIntegrityGapsInfo","AdAllocationIntegrityUtils","Arbiter","Banzai","BanzaiScuba","CSS","CurrentUser","DOM","DOMDimensions","Event","LitestandMessages","NavigationMessage","Run","SubscriptionsHandler","TimeSlice","UserActivity","ViewportTrackingHelper","ViewportTrackingHooks","clearTimeout","clickRefAction","collectDataAttributes","debounce","getElementPosition","getViewportDimensions","pageID","setTimeout","throttle","viewportTrackingBuilder"],(function(a,b,c,d,e,f,g,h){"use strict";__p&&__p();var i=97,j="vpv",k=3,l=2,m=1,n=0,o=1,p=2,q=3,r=4;function s(a){this.cachedAllStories=[],this.cachedVisibleStories={init:!1,data:{}},this.fireTimer=this.fireTimer.bind(this),this.logAnnotatedVPV=this.logAnnotatedVPV.bind(this),this.markStoryRead=this.markStoryRead.bind(this),this.behavior=a}s.prototype.init=function(a){__p&&__p();this.useBanzai=!0;this.vpvDebug=!!a.vpv_debug;this.vpvdDebug=!!a.vpvd_debug;this.vpvdAnalysis=!!a.vpvd_analysis;this.trackingHooks=!!a.tracking_hooks;this.ctaLoggingEnabled=!!a.cta_logging_enabled;this.adAllocationIntegrityLoggingEnabled=!!a.ad_allocation_integrity_logging_enabled;this.readStoryIDs={};this.annotatedStoryIDs={};this.minSizeToBeVisible=200;this.storyIDsWasInView={};this.minFractionToBeVisibleForTimetracking=.5;this.scrollThrottlingInterval=100;this.mouseThrottlingInterval=100;this.keyboardThrottlingInterval=100;this.userActivityPollingInterval=5e3;this.timeToBeConsideredInactive=15e3;this.minTimeToReportImmediately=500;this.discardVPVDIntervalThreshold=9e4;this.active_state_duration=1e3;this.height_diff_to_change_state=25;this.focused_state_duration=3500;this.invalidateAllStoriesCache();this.cachedViewportHeight=b("getViewportDimensions")().height;this.isTimetrackingEnabled=!1;this.activeStories={};this.userInactiveLock=!1;this.userActivityPollerTimeoutID=null;this._headLoadStoryCount=0;this.behavior.getDataFromConfig&&this.behavior.getDataFromConfig(a,this);this.isTimetrackingEnabled&&(this.lastMouseX=-1,this.lastMouseY=-1,this.lastStreamY=-1,this.latestStreamYChangedTimeStamp=-1,this.userFocus=p,this.latestUserFocus=p,this.latestUserActivity="init",this.focusedStory=null,this.latestFocusedStory=null,this.latestActiveStory=null,this.totalVPVDuration={});a.tracking_duration_config&&(this.scrollThrottlingInterval=a.tracking_duration_config.scroll_throttling_interval,this.mouseThrottlingInterval=a.tracking_duration_config.mouse_throttling_interval,this.keyboardThrottlingInterval=a.tracking_duration_config.keyboardThrottlingInterval,this.userActivityPollingInterval=a.tracking_duration_config.user_activity_polling_interval,this.timeToBeConsideredInactive=a.tracking_duration_config.time_to_be_considered_inactive,this.minFractionToBeVisibleForTimetracking=a.tracking_duration_config.min_fraction_to_be_visible,this.minTimeToReportImmediately=a.tracking_duration_config.min_time_to_report_immediately,this.active_state_duration=a.tracking_duration_config.active_state_duration,this.height_diff_to_change_state=a.tracking_duration_config.story_height_diff_to_change_state,this.focused_state_duration=a.tracking_duration_config.focused_state_duration,this.discardVPVDIntervalThreshold=a.tracking_duration_config.discard_vpvd_interval_threshold);a.record_delay!==undefined||h(0);var c=b("debounce")(this.fireTimer,a.record_delay,this);this.initialStories=this.getStoriesInView();this.initialStoriesLogged=!1;this.annotatedVPVLogging&&this.initialStories.forEach(this.logAnnotatedVPV,this);this.subscriptions=new(b("SubscriptionsHandler"))();this.subscriptions.addSubscriptions(this._getScrollListener(c),b("Event").listen(window,"resize",function(){this.invalidateVisibleStoriesCache(),this.cachedViewportHeight=b("getViewportDimensions")().height,c()}.bind(this)),b("Event").listen(window,"focus",function(){this.isTimetrackingEnabled&&this.updateTimeTrackingData(!1,"window_focus")}.bind(this)),b("Event").listen(window,"blur",function(){this.isTimetrackingEnabled&&this.updateTimeTrackingData(!0,"window_blur")}.bind(this)),b("Arbiter").subscribe(b("NavigationMessage").NAVIGATION_BEGIN,this.cleanup.bind(this)),b("Arbiter").subscribe("Stream/totalHeadLoadedStories",function(a,b){this._headLoadStoryCount=b.count}.bind(this)),b("Arbiter").subscribe(b("LitestandMessages").STORIES_INSERTED,function(){if(!this.initialStoriesLogged){var a=this.getStoriesInView();a.forEach(this.logAnnotatedVPV,this)}else c();this.isTimetrackingEnabled&&this.updateTimeTrackingData(!1,"stories_inserted")}.bind(this)));if(this.isTimetrackingEnabled&&this.behavior.getStream){this.updateTimeTrackingData(!1,"init");a=b("throttle")(function(event){this.invalidateVisibleStoriesCache(),this.handleScroll(event)}.bind(this),this.scrollThrottlingInterval);var d=b("throttle")(function(event){return this.handleKeyboard(event)}.bind(this),this.keyboardThrottlingInterval),e=b("throttle")(function(event){return this.handleMouse(event)}.bind(this),this.mouseThrottlingInterval);this.subscriptions.addSubscriptions(b("Event").listen(window,"scroll",a),b("Event").listen(document.documentElement,"DOMMouseScroll",a,undefined,{passive:!0}),b("Event").listen(document.documentElement,"mousewheel",a,undefined,{passive:!0}),b("Event").listen(document.documentElement,"keydown",d),b("Event").listen(document.documentElement,"mouseover",e),b("Event").listen(document.documentElement,"mousemove",e),b("Event").listen(document.documentElement,"click",function(event){this.handleMouse(event)}.bind(this)),b("Arbiter").subscribe("Event/stop",function(a,b){this.handleMouse(b.event)}.bind(this)),b("Arbiter").subscribe("PhotoSnowlift.OPEN",function(){this.userFocus=q,this.handleLayers()}.bind(this)),b("Arbiter").subscribe("PhotoSnowlift.CLOSE",function(){this.userFocus=o,this.focusedStory=null,this.updateTimeTrackingData(!1,"snowlift_close")}.bind(this)));this._userActivityPoller()}b("Run").onLeave(this.cleanup.bind(this));b("Run").onUnload(this.cleanup.bind(this))};s.prototype._getScrollListener=function(a){return b("Event").listen(window,"scroll",a)};s.prototype.cleanup=function(){this.subscriptions&&(this.subscriptions.release(),this.subscriptions=null);this.isTimetrackingEnabled&&(b("clearTimeout")(this.userActivityPollerTimeoutID),this.updateTimeTrackingData(!0,"cleanup"));if(this.annotatedVPVLogging){var a=this.getStoriesInView();a.forEach(this.logAnnotatedVPV,this)}this.initialStories=[];this._headLoadStoryCount=0};s.prototype.fireTimer=function(){__p&&__p();this.initialStoriesLogged||(this.initialStories.forEach(this.markStoryRead,this),this.initialStoriesLogged=!0);this.storiesInView=this.getStoriesInView();this.storiesInView.forEach(this.markStoryRead,this);if(this.trackingHooks){var a=this.isTimetrackingEnabled?this.getVisibleStoriesFromCache():this.getAllStoriesInView(),c=[],d=Object.keys(a);for(var e=0,f=d.length;e<f;e++){var g=d[e];a[g].story&&c.push(a[g].story)}b("ViewportTrackingHooks").updateVisibleViewportObjects(c)}};s.prototype.getSessionID=function(){return null};s.prototype._userActivityPoller=function(){!this.userInactiveLock&&!b("UserActivity").isActive(this.timeToBeConsideredInactive)&&(this.userInactiveLock=!0,this.userFocus=p,this.updateTimeTrackingData(!1,"user_activity_inactive"),b("UserActivity").subscribeOnce(function(){this.userFocus=o,this.updateTimeTrackingData(!1,"user_activity_active"),this.userInactiveLock=!1}.bind(this))),this.userActivityPollerTimeoutID=b("setTimeout")(b("TimeSlice").guard(this._userActivityPoller.bind(this),"ViewportTracking poll setTimeout",{propagationType:b("TimeSlice").PropagationType.EXECUTION}),this.userActivityPollingInterval)};s.prototype.getQueryID=function(a){return-1};s.prototype.getFBFeedLocations=function(a){return-1};s.prototype.getFBFeedInsertionPosition=function(a){return-1};s.prototype.createVPVDTimer=function(a){var b=document.createElement("label");b.setAttribute("for",a.toString());b.setAttribute("class","vpvd_debug_timer");return b};s.prototype.updateVPVDTimer=function(a){__p&&__p();var c=this.activeStories[a].story;if(!c)return;var d=b("DOM").scry(c,".vpvd_debug_timer");if(!d.length){d=[this.createVPVDTimer(c),this.createVPVDTimer(c)];var e=b("DOM").scry(c,".UFIRow");e.length&&e[e.length-1].clientWidth>0?e[e.length-1].appendChild(d[0]):c.appendChild(d[0]);c.insertBefore(d[1],c.firstChild)}e=this.totalVPVDuration[a];c=Math.floor(e/1e3)+"."+Math.floor(e%1e3/100);b("DOM").setContent(d[0],c);b("DOM").setContent(d[1],c)};s.prototype.updateVPVDTimers=function(){for(var a in this.activeStories)Object.prototype.hasOwnProperty.call(this.activeStories,a)&&this.updateVPVDTimer(a)};s.prototype.logVpvdAnalysis=function(a,c,d,e,f,g){__p&&__p();var h=new(b("BanzaiScuba"))("vpv_duration");h.addDenorm("qid",this.getQueryID(this.activeStories[a].story));h.addDenorm("uid",b("CurrentUser").getID());h.addDenorm("vsid",a);h.addInteger("time",Math.round(Date.now()/1e3));h.addInteger("duration",e);h.addInteger("total_duration",f);h.addNormal("story_state",this.activeStories[a].state);h.addNormal("is_active_state",d);h.addNormal("num_visible_stories",this.numVisibleStories);h.addInteger("story_height",this.activeStories[a].story_height);h.addInteger("story_visible_height",this.activeStories[a].height);h.addInteger("state_visible_height",g);h.addInteger("total_visible_height",this.totalVisibleHeight);h.addInteger("total_height",this.totalHeight);h.addNormal("user_focus",this.latestUserFocus);h.addNormal("next_user_focus",this.userFocus);h.addInteger("vpvd",c);h.addInteger("accumulated_vpvd",this.activeStories[a].vpvd);h.addNormal("user_activity",this.latestUserActivity);h.addNormal("next_user_activity",this.userActivity);h.addInteger("story_position_y",this.activeStories[a].y);h.addInteger("feed_insertion_position",this.getFBFeedInsertionPosition(this.activeStories[a].story));h.addNormal("visible_position",this.activeStories[a].visible_position);h.addNormal("is_focused_story",this.activeStories[a].is_focused);h.post()};s.prototype.shouldDiscardStory=function(a){var b=this.activeStories[a].height||0;return b!=this.activeStories[a].story_height&&b<this.totalHeight/2};s.prototype.calculateTotalHeight=function(){this.totalHeight=0;for(var a in this.activeStories)Object.prototype.hasOwnProperty.call(this.activeStories,a)&&(this.totalHeight+=this.activeStories[a].height)};s.prototype.updateVPVDurations=function(a){__p&&__p();var b;if(this.latestUserFocus===p||a-this.latestTimeTrackingTimestamp>this.discardVPVDIntervalThreshold)return;b=(b={},b[m]=0,b[l]=0,b[k]=0,b);var c=a-this.latestTimeTrackingTimestamp>=this.focused_state_duration;this.totalVisibleHeight=0;for(var d in this.activeStories)if(Object.prototype.hasOwnProperty.call(this.activeStories,d)&&!(this.latestUserFocus===o&&c&&this.shouldDiscardStory(d))){var e=this.activeStories[d].state||null,f=this.activeStories[d].height||0;e!==null&&Object.prototype.hasOwnProperty.call(b,e)&&(b[e]+=f);this.totalVisibleHeight+=f}e=0;f=a-this.latestTimeTrackingTimestamp;this.latestUserFocus===o&&(f=b[k]>0?this.focused_state_duration:this.active_state_duration,f=Math.min(f,a-this.latestTimeTrackingTimestamp),e=a-this.latestTimeTrackingTimestamp-f);a=0;var g=k;for(var h=k;h>=m;h--)if(b[h]>0){a=b[h];g=h;break}h=b[k]+b[l]+b[m];b=0;for(d in this.activeStories)if(Object.prototype.hasOwnProperty.call(this.activeStories,d)){if(this.latestUserFocus===o&&c&&this.shouldDiscardStory(d))continue;var i=this.activeStories[d].state||n;if(a>0&&i>=g){i=this.activeStories[d].height||0;b=f*(i/a);this.vpvdAnalysis&&f>0&&this.logVpvdAnalysis(d,b,!0,f,f+e,a);this.activeStories[d].vpvd+=b;this.totalVPVDuration[d]+=b}if(h>0){i=this.activeStories[d].height||0;b=e*(i/h);this.vpvdAnalysis&&e>0&&this.logVpvdAnalysis(d,b,!1,e,f+e,h);this.activeStories[d].vpvd+=b;this.totalVPVDuration[d]+=b}}};s.prototype.updateActiveStory=function(a,b,c,d){this.activeStories[a].state=b,this.activeStories[a].ts=c,this.activeStories[a].height_snapshot=d[a].height,this.activeStories[a].is_focused=this.focusedStory===d[a].story,this.activeStories[a].story_height=d[a].story_height,this.vpvdAnalysis&&(this.activeStories[a].visible_position=d[a].visible_position,this.activeStories[a].y=d[a].y)};s.prototype.updateActiveStories=function(a,b){for(var c in a)if(Object.prototype.hasOwnProperty.call(a,c))if(c in this.activeStories){var d=a[c].height||0;this.activeStories[c].height=d;d=d-(this.activeStories[c].height_snapshot||0);this.focusedStory===a[c].story?this.updateActiveStory(c,k,b,a):d<=-this.height_diff_to_change_state?this.updateActiveStory(c,this.shouldDiscardStory(c)?n:m,b,a):(d>=this.height_diff_to_change_state||this.activeStories[c].is_focused||this.activeStories[c].height===this.activeStories[c].story_height)&&this.updateActiveStory(c,l,b,a)}else this.storyIDsWasInView[c]=!0,this.activeStories[c]={evp_ts:b,story:a[c].story,height:a[c].height,vpvd:0},this.totalVPVDuration[c]||(this.totalVPVDuration[c]=0),this.updateActiveStory(c,l,b,a),this.behavior.afterStoryEntersViewport&&this.behavior.afterStoryEntersViewport(this.activeStories[c].story)};s.prototype.recordVPVDurations=function(a,b){for(var c in this.activeStories)if(Object.prototype.hasOwnProperty.call(this.activeStories,c)&&(b||!(c in a))){var d=this.activeStories[c].vpvd||0;(d>this.focused_state_duration||d===this.totalVPVDuration[c])&&this.recordTimeStoryWasInView(this.activeStories[c]);this.behavior.afterStoryExitsViewport&&this.behavior.afterStoryExitsViewport(this.activeStories[c].story);delete this.activeStories[c]}};s.prototype.updateTimeTrackingData=function(a,b){__p&&__p();this.userActivity=b;this.activeStories||(this.activeStories={});b=Date.now();this.latestTimeTrackingTimestamp||(this.latestTimeTrackingTimestamp=b);var c=this.getVisibleStoriesFromCache();this.calculateTotalHeight();this.updateVPVDurations(b);this.updateActiveStories(c,b);this.vpvdDebug&&this.updateVPVDTimers();this.recordVPVDurations(c,a);a?this.latestTimeTrackingTimestamp=0:this.latestTimeTrackingTimestamp=b;this.latestUserActivity=this.userActivity;this.latestUserFocus=this.userFocus;this.focusedStory&&(this.latestActiveStory=this.focusedStory);this.latestFocusedStory=this.focusedStory;this.focusedStory=null};s.prototype.needsToUpdateTimeTrackingData=function(){return!(this.latestUserFocus===this.userFocus&&(this.userFocus===p||this.userFocus===o&&!this.latestFocusedStory&&!this.focusedStory))};s.prototype.getfocusedStory=function(a){var c=this.getVisibleStoriesFromCache();for(var d in c)if(Object.prototype.hasOwnProperty.call(c,d)){var e=c[d].story;if(e&&b("ViewportTrackingHelper").isDescendantOf(a,e))return e}return null};s.prototype.handleLayers=function(){if(this.userFocus===q||this.userFocus===r){this.focusedStory=this.latestActiveStory;this.updateTimeTrackingData(!1,"media_layer");return!0}return!1};s.prototype.didInteractWithStream=function(a){if(!this.behavior.getStream)return!1;var c=this.behavior.getStream();return b("ViewportTrackingHelper").isDescendantOf(a,c)||b("ViewportTrackingHelper").isDescendantOf(c,a)};s.prototype.handleScroll=function(event){if(this.handleLayers())return;var a=Date.now();this.behavior.getStream||h(0);var c=b("getElementPosition")(this.behavior.getStream()).y;c!=this.lastStreamY||a-this.latestStreamYChangedTimeStamp<2.5*this.scrollThrottlingInterval||this.didInteractWithStream(event.target)?(this.latestStreamYChangedTimeStamp=a,this.userFocus=o):this.userFocus=p;this.lastStreamY=c;(this.userFocus===o||this.needsToUpdateTimeTrackingData())&&this.updateTimeTrackingData(!1,"scroll")};s.prototype.handleKeyboard=function(event){if(this.handleLayers())return;this.didInteractWithStream(event.target)?(this.userFocus=o,this.focusedStory=this.getfocusedStory(event.target)):b("CSS").hasClass(event.target,"shareInput")?(this.userFocus=o,this.focusedStory=this.latestActiveStory):this.userFocus=p;(this.userFocus===o||this.needsToUpdateTimeTrackingData())&&this.updateTimeTrackingData(!1,"keyboard")};s.prototype.handleMouse=function(event){if(this.handleLayers())return;if(event.type!="click"&&event.clientX===this.lastMouseX&&event.clientY===this.lastMouseY)return;event.type==="click"&&this.invalidateVisibleStoriesCache();this.didInteractWithStream(event.target)?(this.userFocus=o,this.focusedStory=this.getfocusedStory(event.target)):this.userFocus=p;this.lastMouseX=event.clientX;this.lastMouseY=event.clientY;this.needsToUpdateTimeTrackingData()&&this.updateTimeTrackingData(!1,event.type)};s.prototype.getStoriesInView=function(){__p&&__p();var a=this.behavior.getAllStories(),c=[],d=!1;for(var e=0;e<a.length;e++){var f=a[e],g=this.behavior.getStoryID(f);if(g&&this.hasBeenVisible(g))continue;if(b("ViewportTrackingHelper").isVisible(f,this.minSizeToBeVisible))f.getAttribute("data-insertion-position")===null&&f.setAttribute("data-insertion-position",(e-this._headLoadStoryCount).toString()),c.push(f),d=!0;else if(d)break}return c};s.prototype.getAllStoriesFromCache=function(){this.cachedAllStories.length===0&&(this.cachedAllStories=this.behavior.getAllStories());return this.cachedAllStories};s.prototype.invalidateAllStoriesCache=function(){this.cachedAllStories=[],this.invalidateVisibleStoriesCache()};s.prototype.getVisibleStoriesFromCache=function(){this.cachedVisibleStories.init||(this.cachedVisibleStories={init:!0,data:this.getAllStoriesInView()});return this.cachedVisibleStories.data};s.prototype.invalidateVisibleStoriesCache=function(){this.cachedVisibleStories={init:!1,data:{}}};s.prototype.getAllStoriesInView=function(){__p&&__p();var a=this.getAllStoriesFromCache(),c={},d=!1,e=0,f=a.length,g=1,h=a.length;this._indexOfLastVisibleStoryOnPreviousPass>f/2&&(e=f-1,f=-1,g=-g);for(var e=e;e!=f;e+=g){var i=a[e],j=b("ViewportTrackingHelper").getHeightIfVisible(i,Math.min(this.minSizeToBeVisible,this.minFractionToBeVisibleForTimetracking*b("DOMDimensions").getElementDimensions(i).height));if(j>0||i===this.focusedStory){i.getAttribute("data-insertion-position")===null&&i.setAttribute("data-insertion-position",(e-this._headLoadStoryCount).toString());var k=this.behavior.getStoryID(i);k&&(c[k]={story:i,height:j,story_height:b("DOMDimensions").getElementDimensions(i).height},d=!0,this.vpvdAnalysis&&(c[k].y=b("getElementPosition")(i).y,c[k].visible_position=e,h=Math.min(h,e)))}else if(d){this._indexOfLastVisibleStoryOnPreviousPass=e-g;break}}if(this.vpvdAnalysis){this.numVisibleStories=0;for(k in c)Object.prototype.hasOwnProperty.call(c,k)&&(c[k].visible_position-=h,this.numVisibleStories++)}return c};s.prototype.getTimetrackingDataToLog=function(a){a={evt:i,time_spent_id:b("pageID"),vpvd_start_timestamp:a.evp_ts||null,vpvd_time_delta:Math.round(a.vpvd||0),story_height:b("DOMDimensions").getElementDimensions(a.story).height,viewport_height:this.cachedViewportHeight};return{ft:a}};s.prototype.getGapsInfoToLog=function(a){__p&&__p();if(a===null||a===undefined)return null;var c=b("AdAllocationIntegrityUtils").getFeedStoryCategory(a),d=new(b("AdAllocationIntegrityGapsInfo"))(c);if(!b("AdAllocationIntegrityUtils").isGapRuleCategory(c))return d;else{c=b("AdAllocationIntegrityUtils").getDedupKey(a);if(c===null)return null;a=this.behavior.getAllStories().filter(function(a){return Object.prototype.hasOwnProperty.call(this.storyIDsWasInView,this.behavior.getStoryID(a))}.bind(this));var e=-1;for(var f=a.length-1;f>=0;f--){var g=b("AdAllocationIntegrityUtils").getDedupKey(a[f]);if(e<0)g!==null&&c===g&&(e=f,d.setDistToTop(e+1));else{g=b("AdAllocationIntegrityUtils").getFeedStoryCategory(a[f]);b("AdAllocationIntegrityUtils").isGapRuleCategory(g)&&d.setDistIfAbsent(g,e-f)}}return d}};s.prototype.recordTimeStoryWasInView=function(a){__p&&__p();if(!this.isTimetrackingEnabled)return;var c=a.story;if(!a.vpvd||!c)return;if(a.vpvd>0){a=this.getTimetrackingDataToLog(a);var d=b("collectDataAttributes")(c,["ft"]);Object.assign(a.ft,d.ft);if(this.adAllocationIntegrityLoggingEnabled){var e=this.getGapsInfoToLog(c);Object.assign(a.ft,e)}e=!!d.ft.ei&&a.ft.vpvd_time_delta>this.minTimeToReportImmediately;a.ei&&delete a.ei;this.sendDataToLog(c,a,e)}};s.prototype.hasBeenVisible=function(a){return a in this.readStoryIDs};s.prototype.sendDataToLog=function(a,c,d){if(this.useBanzai){var e={};d&&(e.delay=3e3);d=this.getSessionID();d&&(c.ft.session_id=d);c.ft.raw_client_time=Date.now()/1e3;b("Banzai").post("feed_tracking",c,e)}else b("clickRefAction")(j,a,null,"FORCE",c)};s.prototype.markStoryRead=function(a){__p&&__p();var c=this.behavior.getStoryID(a);if(!c||this.hasBeenVisible(c))return;this.readStoryIDs[c]=!0;this.annotatedStoryIDs[c]=!0;c=this._getDataToLogImpl(a);var d=b("collectDataAttributes")(a,["ft"]);Object.assign(c.ft,d.ft);delete c.ei;this.sendDataToLog(a,c,!1);this.vpvDebug&&b("CSS").addClass(a,"_5m7s")};s.prototype.logAnnotatedVPV=function(a){__p&&__p();var c=this.behavior.getStoryID(a);if(!c||c in this.annotatedStoryIDs)return;this.annotatedStoryIDs[c]=!0;c=this._getDataToLogImpl(a);var d=b("collectDataAttributes")(a,["ft"]);Object.assign(c.ft,d.ft);delete c.ei;c.ft.vpv_ft_only=1;this.sendDataToLog(a,c,!1)};s.prototype._getDataToLogImpl=function(a){a=this.behavior.getDataToLog(a);a.ft||(a.ft={});return a};s.clearSingleton=function(){};var t={getAllStories:function(){return[]},getStoryID:function(a){return null},getDataToLog:function(a){return{}}};a=b("viewportTrackingBuilder")(function(a){return new s(t)});s.factory=a.factory.bind(a);s.singleton=a.singleton.bind(a);s.clearSingleton=a.clearSingleton.bind(a);s.getBehavior=function(){return t};e.exports=s}),null);
__d("collectSubtreeData",[],(function(a,b,c,d,e,f){__p&&__p();function g(a,b,c,d,e){__p&&__p();if(a.offsetWidth===0&&a.offsetHeight===0)return e;var f={};if(a.getAttribute)for(j=0;j<b.length;j++){k=b[j];var h=a.getAttribute(c[k]);if(h){f[k]={};h=JSON.parse(h);for(var i in d)h[i]!==undefined&&(f[k][i]=!0,e[k]===undefined&&(e[k]={}),e[k][i]===undefined&&(e[k][i]=[]),d[i].length>0&&e[k][i].push(d[i]),e[k][i].push("("+h[i]))}}for(var j=0;j<a.childNodes.length;j++){h=a.childNodes[j];g(h,b,c,d,e)}for(var k in f)for(var l in f[k]){h=e[k][l][e[k][l].length-1];h.length>0&&h.charAt(0)=="("?e[k][l][e[k][l].length-1]=h.substr(1):e[k][l].push(")")}return e}function a(a,b){__p&&__p();var c={};for(var d=0;d<b.length;++d)c[b[d]]="data-"+b[d];d={tn:"","tn-debug":","};var e={};g(a,b,c,d,e);for(var f in e)for(var h in e[f])e[f][h]=e[f][h].join("");return e}e.exports=a}),null);
__d("recordTNTreeData",["collectSubtreeData"],(function(a,b,c,d,e,f){function a(a,c){var d={},e=b("collectSubtreeData")(a,["ft"]);for(var f in e.ft)d[f+"_tree"]=e.ft[f],f==="tn-debug"&&a.setAttribute("tn-debug_subtree",e.ft[f]);d.evt_value=a.offsetHeight;c&&(d.offset=Math.max(0,a.offsetTop-c.offsetTop));return d}e.exports=a}),null);
__d("TimelineViewportTrackingLogType",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({IMPRESSION:"impression",DURATION:"duration"})}),null);
__d("PageTimelineViewportTracking",["csx","Banzai","DataAttributeUtils","DOM","TimelineViewportTrackingLogType","ViewportTracking","$","viewportTrackingBuilder"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();var h,i;function j(a){return{getAllStories:function(){return b("DOM").scry(b("$")("globalContainer"),"._5pat")},getStoryID:function(a){a=JSON.parse(b("DataAttributeUtils").getDataFt(a));return a&&a.top_level_post_id},getDataToLog:function(a){return JSON.parse(b("DataAttributeUtils").getDataFt(a))||{}},getStream:function(){return b("$")("globalContainer")},getDataFromConfig:function(a,b){b.isTimetrackingEnabled=!0}}}h=babelHelpers.inherits(k,b("ViewportTracking"));i=h&&h.prototype;k.prototype.getTimetrackingDataToLog=function(a){a=i.getTimetrackingDataToLog.call(this,a);a.log_type=b("TimelineViewportTrackingLogType").DURATION;return a};k.prototype.getAllStoriesFromCache=function(){return this.behavior.getAllStories()};k.prototype.sendDataToLog=function(a,c,d,e){if(!c.ft)return;a={};e&&(a.retry=e);d&&(a.delay=2e3);b("Banzai").post("page_timeline_vpv_tracking",c,a)};k.prototype.cleanup=function(){l.clearSingleton(),i.cleanup.call(this)};function k(){h.apply(this,arguments)}var l=b("viewportTrackingBuilder")(function(a){var b=new k(j(a));b.init(a);return b});l.init=l.singleton.bind(l);e.exports=l}),null);
__d("PagesPostsSearch",["cx","Arbiter","CSS","DOM","LoadingIndicator.react","React","ReactDOM","Run","SubscriptionsHandler","UIPagelet"],(function(a,b,c,d,e,f,g){__p&&__p();var h=100;a={searchPosts:function(a,c,d){this._pageID=a;this._postsContainer=c;this._searchResultsContainer=d;var e=new(b("SubscriptionsHandler"))();e.addSubscriptions(b("Arbiter").subscribe("PagesTimelineSearch/search",this._handleSearchBarAction.bind(this)));b("Run").onLeave(function(){return e.release()})},_handleSearchBarAction:function(a,c){this._query=c.query,this._query!==""?this._handleSearch():this._handleClearField(),setTimeout(function(){b("Arbiter").inform("PagesTimelineSearch/searchDone",{query:this._query})}.bind(this),h)},_handleSearch:function(){b("CSS").hide(this._postsContainer),b("ReactDOM").render(b("React").createElement("div",{className:"_3x9t"},b("React").createElement(b("LoadingIndicator.react"),{color:"white",size:"large"})),this._searchResultsContainer),b("UIPagelet").loadFromEndpoint("PagePostsSearchResultsPagelet",this._searchResultsContainer,{page_id:this._pageID,search_query:this._query})},_handleClearField:function(){b("DOM").setContent(this._searchResultsContainer,null),b("CSS").show(this._postsContainer)}};e.exports=a}),null);
__d("AlbumMediaUploadUtils",["VideoUploadConfig"],(function(a,b,c,d,e,f){__p&&__p();a={isVideoFile:function(a){a=a.name;var c=b("VideoUploadConfig").videoExtensions;a=a.indexOf(".")!==-1?a.split(".").pop().toLowerCase():"";return c[a]},hasVideos:function(a){return this._filterVideos(a).length>0},_filterVideos:function(a){return this._filterFileOfSupportedType(a,b("VideoUploadConfig").videoExtensions)},_filterFileOfSupportedType:function(a,b){return a.filter(function(a){a=a.indexOf(".")!==-1?a.split(".").pop().toLowerCase():"";return b[a]})}};e.exports=a}),null);
__d("UploadSession",["invariant","AlbumMediaUploadUtils","AsyncRequest","FilePickerEvent","PhotosUploadWaterfall","PUWSteps","SubscriptionsHandler","URI"],(function(a,b,c,d,e,f,g){__p&&__p();var h={};function i(a){"use strict";this._sessionID=a,this._asyncBootstrapped=!1,this._controller=null,this._overlay=null,this._pickers=[],this._pendingPhotoFileLists=[],this._pendingVideoFileLists=[],this._beginLogged=!1,this._albumLimitWasExceeded=!1,this._sessionLimitWasExceeded=!1,this._subscriptions=new(b("SubscriptionsHandler"))()}i.prototype.addFilePicker=function(a){"use strict";__p&&__p();this._pickers.includes(a)||(this._pickers.push(a),this._controller&&a.getSwfID&&a.getSwfID()&&(this._controller.preregisterSwf&&this._controller.preregisterSwf(a.getSwfID())),this._subscriptions.addSubscriptions(a.subscribe(b("FilePickerEvent").BEGIN,function(c,d){this._beginLogged||(this._beginLogged=!0,a.logWaterfallStep(b("PhotosUploadWaterfall").BEGIN),a.logStep(b("PUWSteps").CLIENT_FLOW_BEGIN))}.bind(this)),a.subscribe(b("FilePickerEvent").SELECTED,function(c,d){__p&&__p();a.logStep(b("PUWSteps").CLIENT_SELECT_SUCCESS,{volume:d.files.length});var e=[],f=[];d.files.forEach(function(a){b("AlbumMediaUploadUtils").isVideoFile(a)?e.push(a):f.push(a)});this._controller?(f.length>0&&this._controller.uploadFiles(f),this._videoController&&e.length>0&&this._videoController.uploadFiles(e)):(f.length>0&&this._pendingPhotoFileLists.push(f),e.length>0&&this._pendingVideoFileLists.push(e));if(this._asyncBootstrapped)return;c=a._button;var g=new(b("URI"))(c.getAttribute("ajaxify"));g.addQueryData("num_selected",d.files.length);b("AsyncRequest").bootstrap(g.toString(),c,!0);this._asyncBootstrapped=!0}.bind(this)),a.subscribe(b("FilePickerEvent").SELECT_START,function(){a.logStep(b("PUWSteps").CLIENT_SELECT_BEGIN)}.bind(this)),a.subscribe(b("FilePickerEvent").SELECT_CANCELED,function(){a.logStep(b("PUWSteps").CLIENT_SELECT_CANCEL),this._overlay||(a.logStep(b("PUWSteps").CLIENT_FLOW_CANCEL),this._beginLogged=!1)}.bind(this)),a.subscribe(b("FilePickerEvent").ALBUM_LIMIT_EXCEEDED,function(){this._controller?this._controller.albumLimitExceeded():this._albumLimitWasExceeded=!0}.bind(this)),a.subscribe(b("FilePickerEvent").SESSION_LIMIT_EXCEEDED,function(){this._controller?this._controller.sessionLimitExceeded():this._sessionLimitWasExceeded=!0}.bind(this))))};i.prototype.addController=function(a,c){"use strict";__p&&__p();this._controller=a;this._videoController=c;this._asyncBootstrapped=!0;a=this._controller.getWaterfallID?this._controller.getWaterfallID():this._controller.getWaterfallConfig().waterfallID;c=this._controller.getUploaderApp?this._controller.getUploaderApp():this._controller.getWaterfallConfig().waterfallApp;this._beginLogged||(this._beginLogged=!0,b("PhotosUploadWaterfall").sendSignal({qn:a,step:b("PhotosUploadWaterfall").BEGIN,uploader:c}));if(this._pendingPhotoFileLists.length>0||this._pendingVideoFileLists.length>0){var d=[],e=[];this._pendingVideoFileLists.forEach(function(a){e=e.concat(a)});this._pendingPhotoFileLists.forEach(function(a){d=d.concat(a)});d.length>0&&this._controller.uploadFiles(d);e.length>0&&this._videoController.uploadFiles(e)}else b("PhotosUploadWaterfall").sendSignal({qn:a,step:b("PhotosUploadWaterfall").OVERLAY_FIRST,uploader:c});this._albumLimitWasExceeded&&this._controller.albumLimitExceeded();this._sessionLimitWasExceeded&&this._controller.sessionLimitExceeded()};i.prototype.addOverlay=function(a){"use strict";this._overlay=a};i.prototype.addOverlayAndController=function(a,b){"use strict";this.addOverlay(a),this.addController(b,null)};i.prototype.getFilePickers=function(){"use strict";return this._pickers};i.prototype.cleanup=function(){"use strict";this._subscriptions&&this._subscriptions.release()};i.addFilePickerToSession=function(a,b){"use strict";j(a).addFilePicker(b)};i.addControllerToSession=function(a,b,c){"use strict";j(a).addController(b,c)};i.addOverlayToSession=function(a,b){"use strict";j(a).addOverlay(b)};i.addOverlayAndControllerToSession=function(a,b,c){"use strict";j(a).addOverlayAndController(b,c)};i.restartSessionPersistingFilePickers=function(a){"use strict";var b=j(a),c=new i(a);b.getFilePickers().forEach(function(a){c.addFilePicker(a)});k(a,c)};function j(a){h[a]||(h[a]=new i(a));return h[a]}function k(a,b){h[a]||g(0),h[a].cleanup(),delete h[a],h[a]=b}e.exports=i}),null);
__d("StreamViewportTracking",["DataAttributeUtils","DOM","DOMDimensions","FeedImageLoadPerfLogger","ViewportTracking","ge","gkx","recordTNTreeData","viewportTrackingBuilder"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g,h,i=51;function j(a,c,d,e){__p&&__p();e===void 0&&(e=i);return{_stream:null,getDataFromConfig:function(a,b){b.isTimetrackingEnabled=!0},getAllStories:function(){var a=b("DOM").scry(this.getStream(),d);return a.filter(function(a){return b("DataAttributeUtils").getDataFt(a)})},getStream:function(){if(c)return c;this._stream||(this._stream=b("ge")("home_stream"));return this._stream},getStoryID:function(a){a=JSON.parse(b("DataAttributeUtils").getDataFt(a));return a&&a.mf_story_key},getDataToLog:function(a){__p&&__p();var c=this.getStream();c=b("recordTNTreeData")(a,c);var d=a.getAttribute("data-insertion-position");d!==null&&(c.inspos=d);c.evt=e;c.vpv_time=Math.round(Date.now()/1e3);d=b("DOM").scry(a,".fbStoryAttachmentImage")[0];if(d){a=b("DOMDimensions").getElementDimensions(d);c.story_image_height=a.height;c.story_image_width=a.width}return{ft:c}},afterStoryEntersViewport:b("gkx")("AT6iI7ZM-DEUqLyzH0WIG7tai1ljdAuMyZ79cNQA7lTOnZyBqjqwUgFPVt96-L_E3U8HkpYLqVG1H03r2SDZc5ot")?function(a){b("FeedImageLoadPerfLogger").startMarkers(a)}:function(a){},afterStoryExitsViewport:b("gkx")("AT6iI7ZM-DEUqLyzH0WIG7tai1ljdAuMyZ79cNQA7lTOnZyBqjqwUgFPVt96-L_E3U8HkpYLqVG1H03r2SDZc5ot")?function(a){b("FeedImageLoadPerfLogger").cancelMarkers(a)}:function(a){}}}g=babelHelpers.inherits(k,b("ViewportTracking"));h=g&&g.prototype;k.prototype.getQueryID=function(a){a=JSON.parse(b("DataAttributeUtils").getDataFt(a));return a.qid};k.prototype.getFBFeedLocations=function(a){a=JSON.parse(b("DataAttributeUtils").getDataFt(a));return a.fbfeed_location};k.prototype.getFBFeedInsertionPosition=function(a){a=JSON.parse(b("DataAttributeUtils").getDataFt(a));return a.insertion_position};k.prototype.getTimetrackingDataToLog=function(a){__p&&__p();var c=h.getTimetrackingDataToLog.call(this,a);if(this.ctaLoggingEnabled){a=b("DOM").scry(a.story,"[data-is-cta]").map(function(a){a=b("DataAttributeUtils").getDataFt(a);a=a&&JSON.parse(a);return a&&a.cta_types}).filter(function(a){return!!a});a.length>0&&(c.ft.cta_types=a)}return c};k.prototype.cleanup=function(){l.clearSingleton(),h.cleanup.call(this)};function k(){g.apply(this,arguments)}var l=b("viewportTrackingBuilder")(function(a,b){b=new k(j(a,b,".uiStreamStory"));b.init(a);return b});k.factory=l.factory.bind(l);k.singleton=l.singleton.bind(l);k.clearSingleton=l.clearSingleton.bind(l);k.getBehavior=j;e.exports=k}),null);