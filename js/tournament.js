
var QUESTION_COUNT = 5;
var MAX_ERRORS = 3;

var widget_question = null;
var widget_answers = null;
var widget_answers = null;
var current_question_index = 0;
var ans_visible = [];

function setQuestionText(question_text) {
	if(widget_question)
	{
		widget_question.text(question_text);
	}
}

function setAnswerText(ans_id, ans_text) {
	if(ans_id > 0 && ans_id <= QUESTION_COUNT)
	{
		widget_answers.eq(ans_id-1).text(ans_text);
	}
}

function showAnswer(ans_id)
{
	if(ans_id > 0 && ans_id <= QUESTION_COUNT)
	{
		ans_visible[ans_id] = true;
		setAnswerText(ans_id, QUESTIONS[current_question_index].answers[ans_id-1]);

		audio_correct.trigger('play');
	}
}

function hideAnswer(ans_id)
{
	if(ans_id > 0 && ans_id <= QUESTION_COUNT)
	{
		ans_visible[ans_id] = false;
		setAnswerText(ans_id, '--------------');
	}
}

function hideAnswers()
{
	for(var i = 1; i <= QUESTION_COUNT; i++)
	{
		hideAnswer(i);
	}
}

function setCurrentQuestion(q_id) {
	current_question_index = q_id;

	setQuestionText(QUESTIONS[current_question_index].question);
	hideAnswers();
	
	for(index in error_instances)
	{
		setErrors(error_instances[index], 0);
	}
}

function setErrors(err, val) {
	err.count = val;
	
	if(err.count > MAX_ERRORS)
	{
		err.count = 0;
	}

	if(err.count > 0)
	{
		//if increases, play sound
		audio_error.trigger('play');
	}
	
	// display
	err.elem.html(Array(err.count + 1).join("X<br/>"));
}

$(function() {
	widget_question = $('#question');
	widget_answer_list = $('#answers');
	widget_answers = widget_answer_list.children();
	audio_correct = $('#audio_correct');
	audio_error = $('#audio_error');

	var LEFT = 37;
	var RIGHT = 39;
	var ERR_KEYS = {81: 'left', 87: 'right'}; //Q W
	var NUM_BASE = 48;

	// Register key press events
	$(document).keydown(function(e) {
		var key = e.which;

		if(key == LEFT)
		{
			if(current_question_index > 0)
			{
				setCurrentQuestion(current_question_index - 1);
			}

			e.preventDefault(); // prevent the default action (scroll / move caret)
		}
		else if(key == RIGHT)
		{
			if(current_question_index < QUESTIONS.length - 1)
			{
				setCurrentQuestion(current_question_index + 1);
			}
			else
			{
				hideAnswers();
				setQuestionText('KONIEC');
			}

			e.preventDefault(); // prevent the default action (scroll / move caret)
		}
		else if(key in ERR_KEYS)
		{
			setErrors(error_instances[ ERR_KEYS[key] ], error_instances[ ERR_KEYS[key] ].count+1);
		}
		else
		{ 
			var ans_id = key - NUM_BASE;
			if(ans_id <= QUESTION_COUNT)
			{
				if(! ans_visible[ans_id])
					showAnswer(ans_id);
				else
					hideAnswer(ans_id);

				e.preventDefault(); // prevent the default action (scroll / move caret)
			}
		}
	});
	
	// init errors
	error_instances = {
		'left': {
			count: 0,
			elem: $('#lefterrors')
		},
		'right': {
			count: 0,
			elem: $('#righterrors')
		}
	};


	// Initial question
	setCurrentQuestion(0);

})
