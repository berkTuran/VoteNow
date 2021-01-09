$( "#start_date" ).datepicker(
	
    { 
        maxDate: '0', 
        beforeShow : function()
        {
            jQuery( this ).datepicker({  maxDate: 0 });
        },
        altFormat: "dd/mm/yy", 
        dateFormat: 'dd/mm/yy'
        
    }
    
);

$( "#end_date" ).datepicker( 

    {
        maxDate: '0', 
        beforeShow : function()
        {
            jQuery( this ).datepicker('option','minDate', jQuery('#start_date').val() );
        } , 
        altFormat: "dd/mm/yy", 
        dateFormat: 'dd/mm/yy'
        
    }
    
);
