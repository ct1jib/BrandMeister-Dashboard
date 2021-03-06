<!-- start: Main Menu -->
<div id="sidebar-left" class="span2">
  <div class="nav-collapse sidebar-nav">
    <ul class="nav nav-tabs nav-stacked main-menu">
      <li><a href="<?php echo $config['baseurl']; ?>"><i class="icon-bar-chart"></i><span class="hidden-tablet"> <?php echo $language['Dashboard']['Dashboard'];?></span></a></li>   
      <li><a href="index.php?page=lh"><i class="icon-bullhorn"></i><span class="hidden-tablet"> <?php echo $language['LH']['LastHeard'];?></span></a></li>   
      <li><a href="index.php?page=reflector"><i class="icon-tag"></i><span class="hidden-tablet"> <?php echo $language['Connected reflectors']['Connected reflectors'];?></span></a></li>   
      <li><a href="index.php?page=erouting"><i class="icon-magic"></i><span class="hidden-tablet"> <?php echo $language['Extended routing']['Extended routing'];?></span></a></li>   
      <li>
         <a class="dropmenu" href="#"><i class="icon-folder-close-alt"></i><span class="hidden-tablet"> <?php echo $language['Reports'];?></span></a>
         <ul>
            <li><a class="submenu" href="index.php?page=repeaters"><i class="icon-file-alt"></i><span class="hidden-tablet"> <?php echo $language['Repeaters']['Repeaters'];?></span></a></li>
            <li><a class="submenu" href="index.php?page=dongles"><i class="icon-file-alt"></i><span class="hidden-tablet"> <?php echo $language['Hotspots']['Hotspots'];?></span></a></li>
            <li><a class="submenu" href="index.php?page=masters"><i class="icon-file-alt"></i><span class="hidden-tablet"> <?php echo $language['Masters']['Masters'];?></span></a></li>
            <li><a class="submenu" href="index.php?page=alerts"><i class="icon-file-alt"></i><span class="hidden-tablet"> <?php echo $language['Alerts']['Alerts'];?></span></a></li>
            <li><a class="submenu" href="index.php?page=callstats"><i class="icon-bar-chart"></i><span class="hidden-tablet"> <?php echo $language['Calls']['Calls'];?></span></a></li>
         </ul>   
      </li>
<?php
while (list($key, $value) = each($config['custom_menu'])) {
?>
      <li><a href="<?php echo $value['url']; ?>"><i class="icon-<?php echo $value['icon']; ?>"></i><span class="hidden-tablet"> <?php echo $value['Name']; ?></span></a></li>
<?php
}
?>
    </ul>
  </div>
</div>
<!-- end: Main Menu -->
<noscript>
  <div class="alert alert-block span10">
    <h4 class="alert-heading">Warning!</h4>
    <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p>
  </div>
</noscript>

