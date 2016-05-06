
function push_question(txt, q) {
	txt.push('<p>');
	txt.push(q.question);
	txt.push('<ul>');

	for(i in q.answers)
	{
		txt.push('<li>'+q.answers[i]+'</li>');
	}

	txt.push('</ul>');
}

$(function()
{
	txt = [];

	for(i in QUESTIONS)
	{
		push_question(txt, QUESTIONS[i]);
	}

	$('#questions').html(txt.join(''));
});


