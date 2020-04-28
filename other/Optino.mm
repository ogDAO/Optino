<map version="freeplane 1.6.0">
<!--To view this file, download free mind mapping software Freeplane from http://freeplane.sourceforge.net -->
<node TEXT="Optino" FOLDED="false" ID="ID_1550735058" CREATED="1587891504701" MODIFIED="1587891508939" STYLE="oval">
<font SIZE="18"/>
<hook NAME="MapStyle">
    <properties edgeColorConfiguration="#808080ff,#ff0000ff,#0000ffff,#00ff00ff,#ff00ffff,#00ffffff,#7c0000ff,#00007cff,#007c00ff,#7c007cff,#007c7cff,#7c7c00ff" fit_to_viewport="false"/>

<map_styles>
<stylenode LOCALIZED_TEXT="styles.root_node" STYLE="oval" UNIFORM_SHAPE="true" VGAP_QUANTITY="24.0 pt">
<font SIZE="24"/>
<stylenode LOCALIZED_TEXT="styles.predefined" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="default" ICON_SIZE="12.0 pt" COLOR="#000000" STYLE="fork">
<font NAME="SansSerif" SIZE="10" BOLD="false" ITALIC="false"/>
</stylenode>
<stylenode LOCALIZED_TEXT="defaultstyle.details"/>
<stylenode LOCALIZED_TEXT="defaultstyle.attributes">
<font SIZE="9"/>
</stylenode>
<stylenode LOCALIZED_TEXT="defaultstyle.note" COLOR="#000000" BACKGROUND_COLOR="#ffffff" TEXT_ALIGN="LEFT"/>
<stylenode LOCALIZED_TEXT="defaultstyle.floating">
<edge STYLE="hide_edge"/>
<cloud COLOR="#f0f0f0" SHAPE="ROUND_RECT"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.user-defined" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="styles.topic" COLOR="#18898b" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subtopic" COLOR="#cc3300" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subsubtopic" COLOR="#669900">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.important">
<icon BUILTIN="yes"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.AutomaticLayout" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="AutomaticLayout.level.root" COLOR="#000000" STYLE="oval" SHAPE_HORIZONTAL_MARGIN="10.0 pt" SHAPE_VERTICAL_MARGIN="10.0 pt">
<font SIZE="18"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,1" COLOR="#0033ff">
<font SIZE="16"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,2" COLOR="#00b439">
<font SIZE="14"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,3" COLOR="#990000">
<font SIZE="12"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,4" COLOR="#111111">
<font SIZE="10"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,5"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,6"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,7"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,8"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,9"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,10"/>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,11"/>
</stylenode>
</stylenode>
</map_styles>
</hook>
<hook NAME="AutomaticEdgeColor" COUNTER="13" RULE="ON_BRANCH_CREATION"/>
<node TEXT="Types" POSITION="right" ID="ID_1739703506" CREATED="1587891511466" MODIFIED="1587891556387">
<edge COLOR="#ff0000"/>
<node TEXT="Vanilla Call" ID="ID_113019528" CREATED="1587891530085" MODIFIED="1587891721417"/>
<node TEXT="Vanilla Put" ID="ID_1669087716" CREATED="1587891722594" MODIFIED="1587891726775"/>
<node TEXT="Capped Call" ID="ID_1244011217" CREATED="1587891537771" MODIFIED="1587891540794"/>
<node TEXT="Floored Put" ID="ID_1888274372" CREATED="1587891541663" MODIFIED="1587891543920"/>
</node>
<node TEXT="Risks" POSITION="left" ID="ID_1649922669" CREATED="1587891549181" MODIFIED="1587891561299">
<edge COLOR="#00ff00"/>
<node TEXT="Optino contracts failure" ID="ID_1228595202" CREATED="1587891568231" MODIFIED="1587891581486"/>
<node TEXT="Pricefeed failure" ID="ID_1009144446" CREATED="1587891562926" MODIFIED="1587891585945"/>
<node TEXT="Underlying token failure" ID="ID_860756675" CREATED="1587891587648" MODIFIED="1587891592262">
<node TEXT="DAI" ID="ID_1582582494" CREATED="1587924327393" MODIFIED="1587924331992"/>
</node>
</node>
<node TEXT="Collateral" POSITION="right" ID="ID_1778292705" CREATED="1587891732623" MODIFIED="1587891740992">
<edge COLOR="#00ffff"/>
<node TEXT="100% collateralised" ID="ID_1512346990" CREATED="1587891741395" MODIFIED="1587891745071"/>
<node TEXT="Calls collateralised by baseTokens" ID="ID_1721676641" CREATED="1587891746204" MODIFIED="1587891753748"/>
<node TEXT="Puts collateralised by quoteToken" ID="ID_769122431" CREATED="1587891754495" MODIFIED="1587891760440"/>
</node>
<node TEXT="Terminology" POSITION="left" ID="ID_250333238" CREATED="1587891761826" MODIFIED="1587892263457">
<edge COLOR="#7c0000"/>
<node TEXT="baseToken" ID="ID_107090306" CREATED="1587891766194" MODIFIED="1587891769141"/>
<node TEXT="baseTokens" ID="ID_349882072" CREATED="1587891772035" MODIFIED="1587891773926"/>
<node TEXT="quoteToken" ID="ID_1123552108" CREATED="1587891775322" MODIFIED="1587891777423"/>
<node TEXT="quoteTokens" ID="ID_255986151" CREATED="1587891778459" MODIFIED="1587891782996"/>
<node TEXT="optinoToken" ID="ID_1806552514" CREATED="1587891784325" MODIFIED="1587891786892"/>
<node TEXT="coverToken" ID="ID_66557931" CREATED="1587891788202" MODIFIED="1587891791501"/>
<node TEXT="collateral" ID="ID_778788325" CREATED="1587891792814" MODIFIED="1587891794679"/>
<node TEXT="putCall" ID="ID_998543910" CREATED="1587891798956" MODIFIED="1587891813670"/>
<node TEXT="strike" ID="ID_1610557231" CREATED="1587891815926" MODIFIED="1587891818453"/>
<node TEXT="bound" ID="ID_475614509" CREATED="1587891819950" MODIFIED="1587891822067"/>
<node TEXT="expiry" ID="ID_80595922" CREATED="1587891823487" MODIFIED="1587891837837"/>
<node TEXT="deliveryToken" ID="ID_1263587620" CREATED="1587892164298" MODIFIED="1587892169196"/>
<node TEXT="nonDeliveryToken" ID="ID_1905453743" CREATED="1587892171443" MODIFIED="1587892176028"/>
<node TEXT="payoff" ID="ID_912269229" CREATED="1587892250633" MODIFIED="1587892254044"/>
<node TEXT="coverPayoff" ID="ID_1076384533" CREATED="1587892255308" MODIFIED="1587892258598"/>
<node TEXT="baseDecimals" ID="ID_1997499606" CREATED="1587892380529" MODIFIED="1587892383648"/>
<node TEXT="quoteDecimals" ID="ID_1937584232" CREATED="1587892384733" MODIFIED="1587892387236"/>
<node TEXT="rateDecimals" ID="ID_726428921" CREATED="1587892388674" MODIFIED="1587892391225"/>
<node TEXT="tokens" ID="ID_1469441348" CREATED="1587902702509" MODIFIED="1587902704220"/>
</node>
<node TEXT="Conventions" POSITION="left" ID="ID_175190380" CREATED="1587892344465" MODIFIED="1587892346704">
<edge COLOR="#00007c"/>
<node TEXT="baseToken/quoteToken" ID="ID_1643491207" CREATED="1587892351894" MODIFIED="1587892357839"/>
</node>
<node TEXT="Features" POSITION="right" ID="ID_656598509" CREATED="1587924278295" MODIFIED="1587924283207">
<edge COLOR="#007c00"/>
<node TEXT="Writer locks token to create" ID="ID_1146520790" CREATED="1587924284578" MODIFIED="1587924301718">
<node TEXT="optinoToken" ID="ID_1763051791" CREATED="1587924302699" MODIFIED="1587924308503"/>
<node TEXT="coverToken" ID="ID_668843906" CREATED="1587924309867" MODIFIED="1587924315357"/>
</node>
</node>
<node TEXT="Examples" POSITION="right" ID="ID_1325636285" CREATED="1587953717209" MODIFIED="1587953720437">
<edge COLOR="#7c007c"/>
<node TEXT="ETH/DAI" ID="ID_109260335" CREATED="1587953721351" MODIFIED="1587953739584"/>
</node>
<node TEXT="Workflow" POSITION="left" ID="ID_1045891053" CREATED="1587953752713" MODIFIED="1587953755517">
<edge COLOR="#007c7c"/>
<node TEXT="Seller locks collateral to create optino and cover tokens - mint()" ID="ID_1428329903" CREATED="1587953756984" MODIFIED="1587953858355">
<node TEXT="optino and cover tokens created" ID="ID_48443009" CREATED="1587953863534" MODIFIED="1587953872739"/>
</node>
<node TEXT="Seller sells the optino and/or cover tokens" ID="ID_1826559005" CREATED="1587953789912" MODIFIED="1587953807407"/>
<node TEXT="After expiry, buyer and seller execute optino and/or cover token settle()" ID="ID_1101679248" CREATED="1587953809125" MODIFIED="1587953841183"/>
<node TEXT="Buyer or seller can close() optino and cover tokens" ID="ID_924374108" CREATED="1587953907553" MODIFIED="1587953943781"/>
</node>
<node TEXT="Formulae" POSITION="right" ID="ID_94461364" CREATED="1587954022826" MODIFIED="1587954027736">
<edge COLOR="#7c7c00"/>
<node TEXT="Payoff" ID="ID_1918202749" CREATED="1587954029650" MODIFIED="1587954032906"/>
<node TEXT="Collateral" ID="ID_1074153401" CREATED="1587954033830" MODIFIED="1587954036010"/>
</node>
<node TEXT="Permissions" POSITION="left" ID="ID_550495268" CREATED="1588036359126" MODIFIED="1588036362167">
<edge COLOR="#ff0000"/>
<node TEXT="factory" ID="ID_939038222" CREATED="1588036752887" MODIFIED="1588036754954">
<node TEXT="admin" ID="ID_1470035315" CREATED="1588036367587" MODIFIED="1588036369220">
<node TEXT="addConfig(baseToken, quoteToken, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, description)" ID="ID_1722513437" CREATED="1588036380066" MODIFIED="1588036514542"/>
<node TEXT="updateConfig(baseToken, quoteToken, priceFeed, maxTerm, fee, description)" ID="ID_615389790" CREATED="1588036412297" MODIFIED="1588036593164"/>
<node TEXT="setSeriesSpotIfPriceFeedFails(seriesKey, spot)" ID="ID_694989703" CREATED="1588036632471" MODIFIED="1588036634081"/>
<node TEXT="deprecateContract(newAddress)" ID="ID_685185481" CREATED="1588036448250" MODIFIED="1588036457435"/>
</node>
<node TEXT="users" ID="ID_1713704166" CREATED="1588036370971" MODIFIED="1588036373019">
<node TEXT="mintOptinoTokens(baseToken, quoteToken, priceFeed, callPut, expiry, strike, bound, baseTokens, uiFeeAccount)" ID="ID_1476616503" CREATED="1588036806841" MODIFIED="1588036808665"/>
</node>
</node>
<node TEXT="optino &amp; cover tokens" ID="ID_6846822" CREATED="1588036850389" MODIFIED="1588036860377"/>
</node>
<node TEXT="fee" POSITION="right" ID="ID_1231123725" CREATED="1588036689042" MODIFIED="1588036691618">
<edge COLOR="#0000ff"/>
<node TEXT="mint()" ID="ID_1037658165" CREATED="1588036692144" MODIFIED="1588036707173"/>
<node TEXT="0.01% of collateral locked" ID="ID_602579316" CREATED="1588036708363" MODIFIED="1588036720545"/>
<node TEXT="split with UI fee account" ID="ID_1727358736" CREATED="1588036725913" MODIFIED="1588036733930"/>
</node>
</node>
</map>
