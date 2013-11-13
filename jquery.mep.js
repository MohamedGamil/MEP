/*!
 * Mousemove Element Positioning jQuery Plugin
 * 
 * @author       Mohamed Gamil <Gemy.me>
 * @copyright    Copyright (C) 2013 - Mohamed Gamil
 * @license      MIT
 * @version      1.0
 */
(function ($)
{
	// Console Log Shorthand
	function l()
	{
		try {
			for ( v in arguments )
				console.info( arguments[ v ] );
		}catch( e ) {}
	}
	
	// Plugin's Constructor
	function fn( e, o )
	{
		return this.init( e, o );
	}
	
	// Plugin's Object
	fn.prototype	= 
	{
		/*
		 * Get Positioning Value
		 */
		left_amount		: function ()
		{
			var t	= this,
				m	= t.movement,
				s	= t.o.sensitivity > 0 ? t.o.sensitivity : 2,
				ww	= $(window).width(),
				x	= m.px - ( ww / 2 ),
				a	= ( (t.w.width() / 2) - x ) * (1 / s);
			
			if ( t.o.invert == false )
			{
				a	= a * -1;
			}
			
			return a;
		},
		
		/*
		 * Track Mouse Position
		 */
		handle		: function ()
		{
			var t	= this,
				e	= t.e;
			
			$(document).on( 'mousemove', function ( _ev )
			{
				t.movement	= 
				{
					px	: _ev.pageX,
					py	: _ev.pageY,
					sx	: _ev.screenX,
					sy	: _ev.screenY,
				};
				e.trigger( 'mep_reposition' );
			});
		},
		
		/*
		 * Init Instance For Current Element 
		 */
		init		: function ( e, opts )
		{
			var t	= this,
				e	= $(e),
				w	= $('<div class="mep-wrapper" />'),
				c	= e.children(),
				o	= $.extend(
				{
					sensitivity	: 30,
					invert		: true,
					placeholder	: true
				}, opts), ch;
			
			if ( !e.data('has_mep_tracker') )
			{
				// Prepare Element
				t.e	= e;
				t.o	= o;
				t.w	= w;
				t.e.data( 'mep_options', t.o );
				t.handle();
				
				// Prepare Children Wrapper
				c.wrap( w );
				
				w	= e.find('> .mep-wrapper');
				vp	= e.parents(':visible').filter(':first');
				wh	= ( e.css('float') != 'none' ) ? vp.height() : w.height();
				
				w.css(
				{
					'position'	: 'absolute',
					'width'		: '100%',
					'overflow'	: 'hidden',
					'z-index'	: 1,
					'top'		: w.offset().top,
					'left'		: w.offset().left
				});
				
				// Create a placeholder that fill children position
				if ( t.o.placeholder != false )
				{
					$('<div class="mep-placeholder" />').css( 'height', wh ).appendTo( e );
				}
				
				e.on( 'mep_reposition', function ()
				{
					w.css(
					{
						left : t.left_amount(),
					});
				});
				e.data('has_mep_tracker', true);
			}
			
			// this.instanceID	= Math.ceil( Math.random() * 1000 );
			return this;
		},
	};
	
	// Extend "$.fn"
	$( function ()
	{
		$.fn.mep	= function ( opts )
		{
			return new fn( this, opts );
		};
	});
})(jQuery);