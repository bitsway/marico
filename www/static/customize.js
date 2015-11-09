
//online
var apipath_base_photo_dm='http://eapps001.cloudapp.net/marico/syncmobile/dm_path?cid=MARICO&HTTPPASS=e99business321cba'

//local
//var apipath_base_photo_dm='http://127.0.0.1:8000/marico/syncmobile/dm_path?cid=MARICO&HTTPPASS=e99business321cba'

var apipath="";

var url =''
var latitude="";
var longitude="";

function getLocation() {
	$("#msg_auction_details").html("Confirming location. Please wait.");	
	/*var options = { enableHighAccuracy: false};
	navigator.geolocation.getCurrentPosition(onSuccess, onError , options);*/	
}

// onSuccess Geolocation
function onSuccess(position) {
	$("#lat").val(position.coords.latitude);
	$("#long").val(position.coords.longitude);
	$("#msg_auction_details").html("Location Confirmed");
}

// onError Callback receives a PositionError object
function onError(error) {
   $("#lat").val(0);
   $("#long").val(0);
   $("#msg_auction_details").html("Failed to Confirmed Location.");
}

function replace_special_char(string_value){
	var real_value=string_value.replace(/\)/g,'').replace(/\(/g,'').replace(/\$/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/\"/g,'').replace(/\'/g,"").replace(/\>/g,'').replace(/\</g,'').replace(/\%/g,'').replace(/\&/g,'').replace(/\#/g,'').replace(/\@/g,'').replace(/\|/g,'').replace(/\//g,"").replace(/\\/g,'').replace(/\~/g,'').replace(/\!/g,'').replace(/\;/g,'');
	return real_value;
}

// -------------
$(document).ready(function(){
		$("#wait_image_login").hide();
		$("#loginButton").show();	
		
		$("#wait_image_home").hide();
		$(".btn_auction").show();
		$(".btn_auction").show();
		
		$("#q_lat").val("");
		$("#q_long").val("");
		
		$("#wait_image_auction").hide();	
		$("#btn_auction_submit").show();
		$("#confirmSubmit").show();
		
		$("#wait_image_auction_details").hide();
		
		$("#acution_head_id").val('');
		$("#acution_details_id").val('');	
	
		//alert(localStorage.synced)
		// -------------- If Not synced, Show login
		if ((localStorage.synced!='YES')){	
			$("#c_id").val("")
			$("#user_id").val("")
			$("#user_pass").val("")
			
			url = "#login";		
		}else{
			$("#c_id").val(localStorage.c_id)
			$("#user_id").val(localStorage.user_id)
			$("#user_pass").val(localStorage.user_pass)
			
			url = "#pageHome";
		}
		
		$.mobile.navigate(url);
	});

function get_login() {
	url = "#login";
	$.mobile.navigate(url);
	}

//================= Clear authorization
function clear_autho(){
	var check_clear=$("input[name='clear_auth_check']:checked").val();
	
	if(check_clear!='Yes'){
		$("#error_login").html("Required Confirm Clear");			
	}else{
		localStorage.base_url='';
		localStorage.photo_url='';
		localStorage.photo_submit_url='';
		
		localStorage.synced='';
		localStorage.c_id='';
		localStorage.user_id='';
		localStorage.user_pass='';		
		localStorage.sync_code='';
		
		url = "#login";
		$.mobile.navigate(url);	
		location.reload();
	};
}

//========================= Longin: Check user
function check_user() {
	
	var c_id='MARICO'//$("#c_id").val().toUpperCase();
	var user_id=$("#user_id").val().toUpperCase();
	var user_pass=$("#user_pass").val();
	
	var base_url='';
	var photo_url='';
	var photo_submit_url=''
	//-----
	if (user_id=="" || user_id==undefined || user_pass=="" || user_pass==undefined){
		$("#error_login").html("Required User ID and Password");	
	}else{
			
			$("#wait_image_login").show();
			$("#loginButton").hide();
			$("#error_login").html("")
			$("#error_home_page").html("")
			
			localStorage.base_url='';
			localStorage.photo_url='';
			localStorage.photo_submit_url='';
			
			//----
			$.ajax({
				 type: 'POST',
				 url: apipath_base_photo_dm,
				 success: function(result) {					
					if (result==''){
						$("#wait_image_login").hide();
						$("#loginButton").show();
						$("#error_login").html('Base URL not available');
					}else{
						var startIndex=result.indexOf('<start>');
						var endIndex=result.indexOf('<end>');
						
						var urlResult=result.substring(startIndex+7,endIndex);
						
						var resultArray = urlResult.split('<fd>');		
						if(resultArray.length==3){
							base_url=resultArray[0]
							photo_url=resultArray[1]
							photo_submit_url=resultArray[2]
							
							//-------------
							if(base_url=='' || photo_url==''){	
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Base URL not available');	
							}else{
								//--------------------------
								$("#error_login").html("");		
								$("#loginButton").hide();
								$("#wait_image_login").show();
								
								localStorage.base_url=base_url;
								localStorage.photo_url=photo_url;
								localStorage.photo_submit_url=photo_submit_url;
								
								localStorage.synced='NO'
								
								//-----------------
								//alert(localStorage.base_url+'check_user?cid='+c_id+'&rep_id='+encodeURIComponent(user_id)+'&rep_pass='+encodeURIComponent(user_pass)+'&synccode='+localStorage.sync_code);
								
								$.ajax({
										 type: 'POST',
										 url: localStorage.base_url+'check_user?cid='+c_id+'&rep_id='+encodeURIComponent(user_id)+'&rep_pass='+encodeURIComponent(user_pass)+'&synccode='+localStorage.sync_code,
										 success: function(result) {											
												if (result==''){
													$("#wait_image_login").hide();
													$("#loginButton").show();
													$("#error_login").html('Network timeout. Please ensure you have active internet connection.');
													
												}else{
													syncResult=result
																					
													var syncResultArray = syncResult.split('<SYNCDATA>');
													
													if (syncResultArray[0]=='FAILED'){						
														$("#error_login").html(syncResultArray[1]);
														$("#wait_image_login").hide();
														$("#loginButton").show();
													}else if (syncResultArray[0]=='SUCCESS'){
														
														localStorage.synced='YES';	
														localStorage.c_id=c_id;	
														localStorage.user_id=user_id;
														localStorage.user_pass=user_pass
														
														localStorage.sync_code=syncResultArray[1];
																	
														$("#wait_image_login").hide();
														$("#loginButton").show();
														
														//----------------									
														url = "#pageHome";
														$.mobile.navigate(url);								
														
													}else {									
														$("#wait_image_login").hide();
														$("#loginButton").show();									
														$("#error_login").html("Sync Failed. Authorization or Network Error.");									
													}								
												}
											  },
										  error: function(result) {					 
											  $("#wait_image_login").hide();
											  $("#loginButton").show();
											  $("#error_login").html("Sync Failed. Network Error.");		
											
										  }
									  });//end ajax
									  
									}//base url check
									
						}
					}
				 }
			
			});//end ajax
	   }
	}//function


function getAuction(){	
	$("#error_home_page").html("")	
	$("#wait_image_home").hide();
	$(".btn_auction").show();
	//$("#acution_head_id").val('');
	//$("#acution_details_id").val('');	
	
	var rep_id=localStorage.user_id
	if (rep_id==''||rep_id==undefined){
		$("#error_home_page").html("Required Sync")
	}else{
		
		$("#wait_image_home").show();
		$(".btn_auction").hide();
		
		//alert(localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'get_auction_list?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_home_page").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_home").hide();
						$(".btn_auction").show();
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_home_page").html(resultArray[1]);
							$("#wait_image_home").hide();
							$(".btn_auction").show();
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							
							$("#tbl_auction").empty()
							
							var dataList=result_string.split('<rd>');
							var dataListLength=dataList.length;
							
							//------------------------
							//auctionID+'<fd>'+auctionCategory+'<fd>'+auctionInitiatedDate+'<fd>'+auctionStart+'<fd>'+auctionEnd+'<fd>'+shortNote
							var auctionListData='<tr style="font-size:13px;font-weight:bold; text-shadow:none; color:#408080;" ><td >ID</td><td >Auction Date & Time</td><td >Notes</td><td>&nbsp;</td></tr>'
													
							for (i=0; i < dataListLength; i++){
								var auctionDataList=dataList[i].split('<fd>');
								auctionListData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[0]+'</b></td><td style="border-color:#4E9A9A;"><b>'+auctionDataList[2]+'</b><br>'+auctionDataList[3]+' - '+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[5]+'</td><td style="border-color:#4E9A9A;"><a data-role="button" onClick="auction_details(\''+auctionDataList[0]+'\');" style="background-color:inherit"> >> </a></td></tr>'
								}
							
							
							$("#tbl_auction").append(auctionListData).trigger('create');
							
							$("#msg_auction").html("");
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							
							//--------------------------
							url = "#page_auction";
							$.mobile.navigate(url);	
							
						}else{						
							$("#error_home_page").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_home_page").html('Invalid Request'); 
				  $("#wait_image_home").hide();
				  $(".btn_auction").show();
			  }
			  });//end ajax
		
	}
}

function auction_details(actionId){		
		$("#wait_image_auction_details").hide();
		$("#msg_auction_details").html("")
		$("#btn_auction_submit").show();
		$("#confirmSubmit").show();
		$("#acution_head_id_show").html("");
		$("#auction_date_show").html("");
		$("#auction_time_show").html("");
		
		
		$("input[name='confirmSubmit']:checked").attr('checked',false);
		
		if(actionId==''){
			$("#msg_auction").html("Error in detail show")			
		}else{
			
			//alert(localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+actionId)							
		
			$.ajax({
				 type: 'POST',
				 url: localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+actionId,
				 success: function(result) {						
						if (result==''){
							$("#msg_auction_details").html('Network timeout. Please ensure you have active internet connection.');
							$("#wait_image_auction_details").hide();
							$(".btn_auction").show();
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#msg_auction_details").html(resultArray[1]);
								$("#wait_image_auction_details").hide();
								$(".btn_auction").show();
							}else if (resultArray[0]=='SUCCESS'){
								
								var head_string=resultArray[1];
								var details_string=resultArray[2];
								
								var headList=head_string.split('<fd>');
								//0 auctionID+'<fd>1'+auctionCategory+'<fd>2'+auctionInitiatedDate+'<fd>3'+auctionStart+'<fd>4'+auctionEnd+'<fd>5'+shortNote
								$("#acution_head_id").val(headList[0]);								
								$("#acution_head_id_show").html(headList[0]);
								$("#auction_date_show").html(headList[2]);
								$("#auction_time_show").html(headList[3]+'-'+headList[4]);
								
								$("#tbl_auction_details").empty()
								
								var dataList=details_string.split('<rd>');
								var dataListLength=dataList.length;
								
								//------------------------
								//0 auctionRouteID+'<fd>1'+dateOfDelivery+'<fd>2'+shippingFrom+'<fd>3'+shippingTo+'<fd>4'+vehicleType+'<fd>5'+vehicleCapacity+'<fd>6'+vehicleQty+'<fd>7'+typeofGoods+'<fd>8'+pONo+'<fd>9'+str(minBitRate)+'<fd>10'+str(lastBitRate)
								
								var detailSl=''
								var auctionStrData='<tr style="font-size:13px;font-weight:bold; text-shadow:none; color:#408080;" ><td >Delivery Date</td><td >Route</td><td >Vehicle Type</td><td >Number Of Vehicle</td><td>Bid/Per Vehicle</td><td style="text-align:right;"> Min Rate</td></tr>'
								for (i=0; i < dataListLength; i++){
									var auctionDataList=dataList[i].split('<fd>');
									auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[1]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[2]+' <b>To</b> '+auctionDataList[3]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;text-align:center">'+auctionDataList[6]+' / '+auctionDataList[5]+'MT</td><td style="border-color:#4E9A9A;"><input type="number" id="routeIdRate_'+auctionDataList[0]+'" value="'+auctionDataList[10]+'" style="text-align:right;font-weight:bold;font-size:14px;"/></td><td style="border-color:#4E9A9A;text-align:right;"><span id="routeIdMinRateShow_'+auctionDataList[0]+'">'+auctionDataList[9]+'</span><input type="hidden" id="routeIdMinRate_'+auctionDataList[0]+'" value="'+auctionDataList[9]+'" style="text-align:right;font-weight:bold;font-size:14px;"/></td></tr>'
									
									if (detailSl==''){
											detailSl=auctionDataList[0];
										}else{
											detailSl+=','+auctionDataList[0];
										}									
									}
								
								$("#acution_details_id").val(detailSl);	
								
								$("#tbl_auction_details").append(auctionStrData).trigger('create');
								
								
								$("#msg_auction_details").html("");
								$("#wait_image_auction_details").hide();
								$(".btn_auction").show();
								
								//--------------------------
								url = "#page_auction_details";
								$.mobile.navigate(url);	
								
							}else{						
								$("#msg_auction_details").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_auction_details").hide();
								$(".btn_auction").show();
								}
						}
					  },
				  error: function(result) {			  
					  $("#msg_auction_details").html('Invalid Request'); 
					  $("#wait_image_auction_details").hide();
					  $(".btn_auction").show();
				  }
				  });//end ajax
			
			//--------------------------	
			url = "#page_auction_details";
			$.mobile.navigate(url);
		}
}


function auction_submit(){
	$("#wait_image_auction_details").hide();
	$("#msg_auction_details").html("")
	$("#btn_auction_submit").show();	
	$("#confirmSubmit").show();
	
	var acution_head_id=$("#acution_head_id").val();
	
	var acution_details_id=$("#acution_details_id").val();	
	var detailsIdList=acution_details_id.split(',')
	var listLength=detailsIdList.length;
	
	var routeRateStr=''
	var bidRate=0
	var minRate=0
	var rateFlag=true
	var rateFlagMsg=''
	for (i=0; i < listLength; i++){		
		try{
			bidRate=eval($("#routeIdRate_"+detailsIdList[i]).val());
			minRate=eval($("#routeIdMinRate_"+detailsIdList[i]).val());			
			if (bidRate<=0){
				bidRate=0
			}		
		}catch(e){
			bidRate=0
		}
		//--------------
		if(minRate>0 && bidRate>=minRate){
			rateFlag=false;
			rateFlagMsg='<b>'+bidRate +'</b> should be less than min rate <b>'+ minRate+'</b>';
			break;		
		}
		//------------
		if (bidRate>0){		
			if (routeRateStr==''){
				routeRateStr=detailsIdList[i]+'<fd>'+bidRate;
			}else{
				routeRateStr+='<rd>'+detailsIdList[i]+'<fd>'+bidRate;
			}		
		}
	}
	
	var confirmStatus=$("input[name='confirmSubmit']:checked").val();
	if (confirmStatus!='YES'){
		$("#msg_auction_details").text("Required Checked Confirmation");
	}else{
		if (acution_head_id==''){
			$("#msg_auction_details").text("Auction not available");
		}else{
			if (rateFlag == false){
				$("#msg_auction_details").html(rateFlagMsg);					
			}else{			
				if (routeRateStr==''){
					$("#msg_auction_details").html('Required valid rate');
				}else{								
					$("#wait_image_auction_details").show();
					//$("#btn_auction_submit").hide();
					//$("#confirmSubmit").hide();
					
					//alert(localStorage.base_url+'auction_submit?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+acution_head_id+'&route_rate='+encodeURIComponent(routeRateStr)+'&acution_details_id='+encodeURIComponent(acution_details_id))							
					
					$.ajax({
						 type: 'POST',
						 url: localStorage.base_url+'auction_submit?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+acution_head_id+'&route_rate='+encodeURIComponent(routeRateStr)+'&acution_details_id='+encodeURIComponent(acution_details_id),
						 success: function(result) {						
								if (result==''){
									$("#msg_auction_details").html('Network timeout. Please ensure you have active internet connection.');
									$("#wait_image_auction_details").hide();
									//$("#btn_auction_submit").show();
									//$("#confirmSubmit").show();
								}else{
									var resultArray = result.split('<SYNCDATA>');			
									if (resultArray[0]=='FAILED'){						
										$("#msg_auction_details").html(resultArray[1]);
										$("#wait_image_auction_details").hide();
										//$("#btn_auction_submit").show();
										//$("#confirmSubmit").show();
										
										var minBidStr=resultArray[2];
										//-------------
										if(minBidStr!=''){
											var minBidList=minBidStr.split('<rd>');
											var minBidListLength=minBidList.length;
																
											var routeId=''
											var routeMinValue=''
											for (i=0; i < minBidListLength; i++){
												var minBidDataList=minBidList[i].split('<fd>');
												routeId=minBidDataList[0];
												routeMinValue=minBidDataList[1];											
												$("#routeIdMinRate_"+routeId).val(routeMinValue);
												$("#routeIdMinRateShow_"+routeId).html(routeMinValue);												
											}
										}
										
									}else if (resultArray[0]=='SUCCESS'){									
										var result_string=resultArray[1];
										var minBidStr=resultArray[2];
										
										//-------------
										var minBidList=minBidStr.split('<rd>');
										var minBidListLength=minBidList.length;
																			
										var routeId=''
										var routeMinValue=''
										for (i=0; i < minBidListLength; i++){
											var minBidDataList=minBidList[i].split('<fd>');
											routeId=minBidDataList[0];
											routeMinValue=minBidDataList[1];
											
											$("#routeIdMinRate_"+routeId).val(routeMinValue);
											$("#routeIdMinRateShow_"+routeId).html(routeMinValue);	
											
										}
										
										//----------------
										$("#msg_auction_details").html(result_string);										
										$("#wait_image_auction_details").hide();
										//$("#btn_auction_submit").hide();
										//$("#confirmSubmit").hide();
										
										//--------------------------
										
									}else{						
										$("#msg_auction_details").html('Authentication error. Please register and sync to retry.');
										$("#wait_image_auction_details").hide();
										//$("#btn_auction_submit").show();
										//$("#confirmSubmit").show();
										}
								}
							  },
						  error: function(result) {			  
							  $("#msg_auction_details").html('Invalid Request'); 
							  $("#wait_image_auction_details").hide();
							  //$("#btn_auction_submit").show();
							 // $("#confirmSubmit").show();
						  }
						  });//end ajax
				   }
				}
			}
		}
	//}
}

function refreshAuction(){	
	$("#msg_auction_details").html("")	
	$("#wait_image_auction_details").hide();	
	$("#btn_auction_submit").show();
	$("#confirmSubmit").show();
	
	var acution_head_id=$("#acution_head_id").val();
	
	auction_details(acution_head_id);	
}

function getAuctionHistory(){	
	$("#error_home_page").html("")
	$("#wait_image_auction_history").hide();
	
	$("#wait_image_home").hide();
	$(".btn_auction").show();
	
	var rep_id=localStorage.user_id
	if (rep_id==''||rep_id==undefined){
		$("#error_home_page").html("Required Sync")
	}else{
		
		$("#wait_image_home").show();
		$(".btn_auction").hide();
		
		//alert(localStorage.base_url+'get_auction_history?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'get_auction_history?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_home_page").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_home").hide();
						$(".btn_auction").show();
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_home_page").html(resultArray[1]);
							$("#wait_image_home").hide();
							$(".btn_auction").show();
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							
							var dataList=result_string.split('<rd>');
							var dataListLength=dataList.length;
							
							//------------------------
							var auctionStrData='<tr style="font-size:13px;font-weight:bold; text-shadow:none; color:#408080;" ><td >ID</td><td >Auction Date & Time</td><td >Notes</td><td>&nbsp;</td></tr>'
													
							for (i=0; i < dataListLength; i++){
								var auctionDataList=dataList[i].split('<fd>');
								auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[0]+'</b></td><td style="border-color:#4E9A9A;"><b>'+auctionDataList[2]+'</b><br>'+auctionDataList[3]+' - '+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[5]+'</td><td style="border-color:#4E9A9A;"><input type="hidden" id="aHisId_'+auctionDataList[0]+'" value="'+dataList[i]+'"/><a data-role="button" onClick="auction_history_details(\''+auctionDataList[0]+'\');" style="background-color:inherit"> >> </a></td></tr>'
								}
							
							$("#tbl_auction_history").empty()
							$("#tbl_auction_history").append(auctionStrData).trigger('create');
							
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							
							$("#msg_auction_history").html("")
							
							//--------------------------
							url = "#page_auction_history";
							$.mobile.navigate(url);	
							
						}else{						
							$("#error_home_page").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_home_page").html('Invalid Request'); 
				  $("#wait_image_home").hide();
				  $(".btn_auction").show();
			  }
			  });//end ajax
		
	}
}


function auction_history_details(actionId){
		$("#wait_image_auction_history").hide();
		$("#msg_auction_history").html("")
				
		$("#acution_history_head_id_show").html("");
		$("#auction_history_date_show").html("");
		$("#auction_history_time_show").html("");
				
		if(actionId==''){
			$("#msg_auction_history").html("Error in detail show")			
		}else{
			var acutionData=$("#aHisId_"+actionId).val();
			
			//alert(localStorage.base_url+'get_auction_history_details?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+actionId)							
		
			$.ajax({
				 type: 'POST',
				 url: localStorage.base_url+'get_auction_history_details?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+actionId,
				 success: function(result) {						
						if (result==''){
							$("#msg_auction_history").html('Network timeout. Please ensure you have active internet connection.');
							$("#wait_image_auction_history").hide();
							
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#msg_auction_history").html(resultArray[1]);
								$("#wait_image_auction_history").hide();
								
							}else if (resultArray[0]=='SUCCESS'){
								
								var details_string=resultArray[1];
								
								var auctionDataList=acutionData.split('<fd>');
								//0 auctionID+'<fd>1'+auctionCategory+'<fd>2'+auctionInitiatedDate+'<fd>3'+auctionStart+'<fd>4'+auctionEnd+'<fd>5'+shortNote
								
								$("#acution_history_head_id_show").html(auctionDataList[0]);
								$("#auction_history_date_show").html(auctionDataList[2]);
								$("#auction_history_time_show").html(auctionDataList[3]+'-'+auctionDataList[4]);
								
								$("#tbl_auction_history_details").empty()
								
								var dataList=details_string.split('<rd>');
								var dataListLength=dataList.length;
								
								//------------------------
								//0 auctionRouteID+'<fd>1'+dateOfDelivery+'<fd>2'+shippingFrom+'<fd>3'+shippingTo+'<fd>4'+vehicleType+'<fd>5'+vehicleCapacity+'<fd>6'+vehicleQty+'<fd>7'+typeofGoods+'<fd>8'+pONo+'<fd>9'+str(minBitRate)
								
								var auctionStrData='<tr style="font-size:13px;font-weight:bold; text-shadow:none; color:#408080;" ><td >Delivery Date</td><td >Route</td><td >Vehicle Type</td><td >Number Of Vehicle</td><td style="text-align:right;">Bid/Per Vehicle</td><td style="text-align:right;">Status</td></tr>'
								for (i=0; i < dataListLength; i++){
									var auctionDataList=dataList[i].split('<fd>');
									auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[1]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[2]+' <b>To</b> '+auctionDataList[3]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;text-align:center">'+auctionDataList[6]+' / '+auctionDataList[5]+'MT</td><td style="border-color:#4E9A9A;text-align:right;">'+auctionDataList[9]+'</td><td style="border-color:#4E9A9A;text-align:right;color:#008040">Awarded</td></tr>'																	
									}
								
								$("#tbl_auction_history_details").append(auctionStrData).trigger('create');
								
								$("#msg_auction_history").html("");
								$("#wait_image_auction_history").hide();
																
								//--------------------------
								url = "#page_auction_history_details";
								$.mobile.navigate(url);	
								
							}else{						
								$("#msg_auction_history").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_auction_history").hide();
								
								}
						}
					  },
				  error: function(result) {			  
					  $("#msg_auction_history").html('Invalid Request'); 
					  $("#wait_image_auction_history").hide();					 
				  }
			});//end ajax
			
		}
}


//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}

// ----------------Camera------------

//image Profile
function getPrescriptionImage() {
	navigator.camera.getPicture(onSuccessProfile, onFailProfile, { quality: 10,
		destinationType: Camera.DestinationType.FILE_URI });
}
function onSuccessProfile(imageURI) {
    var image = document.getElementById('myImagePrescription');
    image.src = imageURI;
	imagePath = imageURI;
	$("#prescriptionPhoto").val(imagePath);
}
function onFailProfile(message) {
	imagePath="";
    alert('Failed because: ' + message);
}


//------------------------------------------------------------------------------

//File upload 
function uploadPhoto(imageURI, imageName) {
    var options = new FileUploadOptions();
    options.fileKey="upload";
    options.fileName=imageName;
    options.mimeType="image/jpeg";
	
    var params = {};
    params.value1 = "test";
    params.value2 = "param";
	
    options.params = params;
	
    var ft = new FileTransfer();
     ft.upload(imageURI, encodeURI(localStorage.photo_submit_url+"fileUploaderPrescription/"),winProfile,failProfile,options);
}

function winProfile(r) {
}

function failProfile(error) {
	$("#msg_auction_details").text('Memory Error. Please take new picture and Submit');
}




