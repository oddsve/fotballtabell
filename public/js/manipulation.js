  $(".dette-laget").click(function(e){
    e.preventDefault();
    $('.kamper').hide();
    $('.'+this.id).show(200);
    $('.vis-alle').show(200);
  });

  $(".vis-alle").click(function(e){
    e.preventDefault();
    $('.kamper').show(200);
    $('.vis-alle').hide();

  });

  $(".vis-alle").hide();
