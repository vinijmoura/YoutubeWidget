VSS.init({
    explicitNotifyLoaded: true,
    usePlatformStyles: true
});

VSS.require(["TFS/Dashboards/WidgetHelpers"],
    function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("VSTSSprintsYouTubeWidget", function () {

            var youTubeBaseUrl = 'https://www.googleapis.com/youtube/v3/';
            var youTubeApiKeyParam = '?key=AIzaSyDc5hz8E8MtQvaV9kpfxUK4R_4dycbnm1M';

            var $dropPlaylists = $('#dropPlaylists');
            var $listVideosContainer = $('#listVideosContainer');
            var $listVideos = $('#listVideos');
            var $videoContainer = $('.video-container');

            function buildVideoElementHtml(video) {
                return '<a href="#" class="video-item list-group-item list-group-item-action flex-column align-items-start"'
                    + 'data-id="' + video.contentDetails.videoId + '">'
                    + '<div class="d-flex w-100 justify-content-between">'
                    + '<img class="img-fluid video-icon" src="' + video.snippet.thumbnails.default.url + '">'
                    + '<h6 class="mb-1 text-right">' + video.snippet.title + '</h6>'
                    + '</div>'
                    + '</a>';
            }

            function loadPlaylists() {
                $dropPlaylists.empty();
                var url = youTubeBaseUrl + 'playlists';
                url += youTubeApiKeyParam;
                url += '&part=id,snippet,status&channelId=UC_QhmUDhKhUKKTC6aJr7n2g&maxResults=50';
                $.get(url,
                    function (data, status) {
                        var result = data;
                        if (result.items) {
                            fillDropPlaylists(result.items);
                        }
                    });
            }

            function fillDropPlaylists(playlists) {
                $('<option />')
                    .text('Select a playlist...')
                    .appendTo($dropPlaylists);
                $.each(playlists, function (index, playlist) {
                    $('<option />')
                        .text(playlist.snippet.title)
                        .val(playlist.id)
                        .appendTo($dropPlaylists);
                });
            }

            function selectPlaylist(evt) {
                $listVideosContainer.hide();
                var selected = $dropPlaylists.val();
                if (selected) {
                    loadVideos(selected);
                }
            }

            function loadVideos(playlistId) {
                $listVideos.empty();
                var url = youTubeBaseUrl + 'playlistItems';
                url += youTubeApiKeyParam;
                url += '&part=contentDetails,snippet&playlistId=' + playlistId;
                $.get(url,
                    function (data, status) {
                        var result = data;
                        if (result.items) {
                            fillListVideos(result.items);
                            $listVideosContainer.show();
                        }
                    });
            }

            function fillListVideos(videos) {
                $.each(videos, function (index, video) {
                    var html = buildVideoElementHtml(video);
                    $(html).appendTo($listVideos);
                });
            }

            function selectVideo(evt) {
                evt.preventDefault();
                var videoId = $(evt.currentTarget).data('id');
                addEmbedVideo(videoId);
            }

            function addEmbedVideo(videoId) {
                $videoContainer.empty();
                if (!videoId) return;
                var youTubeEmbed = '<iframe width="560" height="315"'
                    + ' src="https://www.youtube.com/embed/' + videoId + '?rel=0"'
                    + ' frameborder="0" allow="autoplay; encrypted-media"'
                    + ' allowfullscreen class="video-frame">'
                    + ' </iframe>';
                $(youTubeEmbed).appendTo($videoContainer);
            }

            return {
                load: function (widgetSettings) {
                    loadPlaylists();
                    $dropPlaylists.on('change', selectPlaylist);
                    $listVideosContainer.on('click', 'a', selectVideo);
                    return WidgetHelpers.WidgetStatusHelper.Success();
                }
            }
        });
        VSS.notifyLoadSucceeded();
    });