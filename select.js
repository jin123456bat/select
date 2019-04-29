jQuery.fn.extend({
	select:function(args){
		var selector_container = $('<div class="selector_container"></div>');
		var selector = $('<div class="selector select placeholder"></div>');
		var obj = $(this);
		
		//设置默认的placeholder
		var args_placeholder = obj.find('option[disabled][selected]').html();
		if(!args_placeholder)
		{
			//检查是否有默认的selected的option
			var args_placeholder_temp = [];
			obj.find('option[selected]').each(function(){
				args_placeholder_temp.push($(this).html());
			})
			if(args_placeholder_temp.length>0)
			{
				args_placeholder = args_placeholder_temp.join(',');
				selector.removeClass('placeholder');
				obj.trigger('change');
			}
			else
			{
				args_placeholder = '请选择';
			}
		}
		
		if(args.class)
		{
			selector_container.addClass(args.class);
		}
		
		if(args.style)
		{
			selector_container.css(args.style);
		}
		
		//隐藏旧的selector
		obj.css('display','none');
		
		//给新的selector添加placeholder
		selector.html(args_placeholder);
		
		//当设置obj的值的时候 将值同步到selector上
		obj.on('change',function(){
			if($(this).val().length>0)
			{
				var placeholder_array = [];
				$.each($(this).val(),function(k,v){
					placeholder_array.push(obj.find('option[value="'+v+'"]').html());
				});
				selector.html(placeholder_array.join(',')).removeClass('placeholder');
			}
			else
			{
				selector.html(args_placeholder).addClass('placeholder');
			}
		});
		
		selector.on('click',function(e){
			
			//关闭其他的弹窗
			$('.selector_container .selector_body').remove();
			
			if(selector_container.find('.selector_body').length>0)
			{
				return false;
			}
			
			var selector_body = $('<div class="selector_body"></div>').on('click',function(){
				return false;
			});
			if(args.search)
			{
				var selector_body_input = $('<input type="text">').on('keyup',function(){
					var val = $(this).val();
					if(val.length==0)
					{
						selector_body.find('.selector_option').removeClass('display-none');
					}
					else
					{
						selector_body.find('.selector_option').each(function(){
							if($(this).find('.selector_option_item').html().indexOf(val)==-1)
							{
								$(this).addClass('display-none');
							}
							else
							{
								$(this).removeClass('display-none');
							}
						});
					}
				});
				selector_body.append(selector_body_input);
			}
			
			
			selector_container.append(selector_body);
			
			//只有多选才配置全选按钮
			if(obj.prop('multiple'))
			{
				var selector_body_select = $('<div class="selector_body_select"><button class="select_all">全选</button><button class="select_none">取消</button></div>').on('click','.select_all',function(){
					selector_body.find('.selector_option').addClass('active');
					setVal();
				}).on('click','.select_none',function(){
					selector_body.find('.selector_option').removeClass('active');
					setVal();
				});
				selector_body.append(selector_body_select);
			}
			
			var setVal = function(){
				obj.find('option').prop('selected',false);
				if(selector_body.find('.selector_option.active').length>0)
				{
					var val = [];
					selector_body.find('.selector_option.active').each(function(){
						val.push($(this).find('.selector_option_item').html());
						var value = $(this).data('value');
						obj.find('option[value="'+value+'"]').prop('selected',true);
					});
					selector.html(val.join(',')).removeClass('placeholder');
				}
				else
				{
					selector.html(args_placeholder).addClass('placeholder');
				}
				obj.trigger('change');
			}
			
			$.each(obj.find('option').not('[disabled][selected]'),function(){
				var value = $(this).attr('value');
				var html = $(this).html();
				var option = $('<div class="selector_option" data-value="'+value+'"><div class="selector_option_item">'+html+'</div><div class="graph-ok"></div></div>').on('click',function(){
					
					if($(this).hasClass('active'))
					{
						$(this).removeClass('active');
					}
					else
					{
						//如果是单选 选择之前先清除其他选中的值
						if(!obj.prop('multiple'))
						{
							selector_body.find('.selector_option').removeClass('active');
						}
						
						$(this).addClass('active');
					}
					
					setVal();
					
					//如果是单选 那么选择完毕后直接关掉
					if(!obj.prop('multiple'))
					{
						selector_container.find('.selector_body').remove();
					}
					
					return false;
				});
				
				//获取select中已选择的值
				if(obj.prop('multiple'))
				{
					if($.inArray(value,obj.val()) != -1)
					{
						option.addClass('active');
					}
				}
				else
				{
					if(value == obj.val())
					{
						option.addClass('active');
					}
				}
				
				selector_body.append(option);
			});
			
			return false;
		});
		
		$(document).on('click',function(){
			selector_container.find('.selector_body').remove();
		});
		
		selector_container.append(selector).insertAfter(obj);
	}
});