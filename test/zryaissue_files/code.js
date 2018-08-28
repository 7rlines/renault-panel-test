function _MT_RichMediaRun(placeId)
{
}
(function() {
	var p_set = [
		['mediatoday_auto', 5627, 5758],
		['mediatoday_business', 5193, 5266, 5276, 5284, 5330, 5342, 5351, 5355, 5384, 5411, 5425, 5506, 5613, 5732, 5755, 5770],
		['mediatoday_women', 5216, 5576, 5756, 6010, 6012, 6019, 6020, 6144, 6168],
		['mediatoday_smi', 5197, 5206, 5289, 5569, 5740, 5786]
	];
	var cat = 0;
	for (var s = 0; ! cat && s < p_set.length; ++s) {
		var p = p_set[ s ];
		for (var i = 1; ! cat && i < p.length; ++i)
			if (p[ i ] == 6404)
				cat = p[ 0 ]
	}
	if (! cat)
		return;
	(new Image(1, 1)).src = '//www.tns-counter.ru/V13a****mediatoday_ru/ru/CP1251/tmsec=' + cat + '/' + Math.floor(Math.random() * 100000);
})();
eval('');

(function() {
	_MT_jsLoadDelayed('//cdn.mediatoday.ru/storage/classify/agent.js', function() {
		classifyAgent('//mediatoday.ru/inventory/classify', 'VOCOhzzrh46r5pO');
	}, null);
})();

(function() {
	(new Image(1, 1)).src = '//ssp.adriver.ru/cgi-bin/sync.cgi?ssp_id=49&external_id=VOCOhzzrh46r5pO';
})();
