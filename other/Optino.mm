<map version="freeplane 1.6.0">
<!--To view this file, download free mind mapping software Freeplane from http://freeplane.sourceforge.net -->
<node TEXT="Optino" FOLDED="false" ID="ID_1550735058" CREATED="1587891504701" MODIFIED="1587891508939" STYLE="oval">
<font SIZE="18"/>
<hook NAME="MapStyle">
    <properties fit_to_viewport="false" edgeColorConfiguration="#808080ff,#ff0000ff,#0000ffff,#00ff00ff,#ff00ffff,#00ffffff,#7c0000ff,#00007cff,#007c00ff,#7c007cff,#007c7cff,#7c7c00ff"/>

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
<hook NAME="AutomaticEdgeColor" COUNTER="19" RULE="ON_BRANCH_CREATION"/>
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
<node TEXT="Terminology &amp; Conventions" POSITION="left" ID="ID_250333238" CREATED="1587891761826" MODIFIED="1588812043952">
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
<node TEXT="decimals" ID="ID_1146930491" CREATED="1588806833766" MODIFIED="1588806836205"/>
<node TEXT="baseDecimals" ID="ID_1997499606" CREATED="1587892380529" MODIFIED="1587892383648"/>
<node TEXT="quoteDecimals" ID="ID_1937584232" CREATED="1587892384733" MODIFIED="1587892387236"/>
<node TEXT="rateDecimals" ID="ID_726428921" CREATED="1587892388674" MODIFIED="1587892391225"/>
<node TEXT="tokens" ID="ID_1469441348" CREATED="1587902702509" MODIFIED="1587902704220"/>
<node TEXT="pairs" ID="ID_1400337676" CREATED="1588812022175" MODIFIED="1588812025530">
<node TEXT="baseToken/quoteToken" ID="ID_1750311286" CREATED="1588812026663" MODIFIED="1588812030475"/>
</node>
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
<node TEXT="owner" ID="ID_1470035315" CREATED="1588036367587" MODIFIED="1588812216695">
<node TEXT="addConfig(baseToken, quoteToken, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, description)" ID="ID_1722513437" CREATED="1588036380066" MODIFIED="1588036514542"/>
<node TEXT="updateConfig(baseToken, quoteToken, priceFeed, maxTerm, fee, description)" ID="ID_615389790" CREATED="1588036412297" MODIFIED="1588036593164"/>
<node TEXT="setSeriesSpotIfPriceFeedFails(seriesKey, spot)" ID="ID_694989703" CREATED="1588036632471" MODIFIED="1588036634081"/>
<node TEXT="deprecateContract(newAddress)" ID="ID_685185481" CREATED="1588036448250" MODIFIED="1588036457435"/>
<node TEXT="recoverTokens(...)" ID="ID_825323940" CREATED="1588812510432" MODIFIED="1588812513590"/>
<node TEXT="transferOwnership(...)" ID="ID_1005141009" CREATED="1588812496946" MODIFIED="1588812501297"/>
<node TEXT="acceptOwnership()" ID="ID_1448292548" CREATED="1588812541341" MODIFIED="1588812543065"/>
</node>
<node TEXT="users" ID="ID_1713704166" CREATED="1588036370971" MODIFIED="1588036373019">
<node TEXT="mintOptinoTokens(baseToken, quoteToken, priceFeed, callPut, expiry, strike, bound, baseTokens, uiFeeAccount)" ID="ID_1476616503" CREATED="1588036806841" MODIFIED="1588036808665"/>
</node>
</node>
<node TEXT="optino &amp; cover tokens" ID="ID_6846822" CREATED="1588036850389" MODIFIED="1588036860377">
<node TEXT="owner (factory)" ID="ID_424942681" CREATED="1588812174270" MODIFIED="1588812225967">
<node TEXT="mint(...)" ID="ID_658179811" CREATED="1588812413739" MODIFIED="1588812417770"/>
<node TEXT="recoverTokens(...)" ID="ID_1420321521" CREATED="1588812434895" MODIFIED="1588812437335"/>
<node TEXT="transferOwnership(...)" ID="ID_1715372607" CREATED="1588812490114" MODIFIED="1588812493528"/>
<node TEXT="acceptOwnership()" ID="ID_1419551902" CREATED="1588812530204" MODIFIED="1588812537118"/>
</node>
<node TEXT="users" ID="ID_531365294" CREATED="1588812177519" MODIFIED="1588812179877">
<node TEXT="ERC20 write" ID="ID_575169943" CREATED="1588812152726" MODIFIED="1588812300786">
<node TEXT="transfer(...)" ID="ID_326430806" CREATED="1588812159597" MODIFIED="1588812163879"/>
<node TEXT="approve(...)" ID="ID_1663065149" CREATED="1588812165225" MODIFIED="1588812168244"/>
<node TEXT="transferFrom(...)" ID="ID_1798711263" CREATED="1588812231387" MODIFIED="1588812236443"/>
</node>
<node TEXT="ERC20 read" ID="ID_216441865" CREATED="1588812302166" MODIFIED="1588812304802">
<node TEXT="totalSupply()" ID="ID_1504104617" CREATED="1588812317036" MODIFIED="1588812319639"/>
<node TEXT="balanceOf(...)" ID="ID_812306042" CREATED="1588812324574" MODIFIED="1588812326877"/>
<node TEXT="allowance(...)" ID="ID_1125177803" CREATED="1588812331670" MODIFIED="1588812333951"/>
</node>
<node TEXT="ERC20+ write" ID="ID_83222376" CREATED="1588812383601" MODIFIED="1588812387283">
<node TEXT="approveAndCall(...)" ID="ID_913281872" CREATED="1588812387962" MODIFIED="1588812391178"/>
</node>
<node TEXT="ERC20+ read" ID="ID_1158542859" CREATED="1588812345982" MODIFIED="1588812352761">
<node TEXT="symbol()" ID="ID_706664646" CREATED="1588812353631" MODIFIED="1588812355572"/>
<node TEXT="name()" ID="ID_1136663323" CREATED="1588812356522" MODIFIED="1588812358157"/>
<node TEXT="decimals()" ID="ID_699375372" CREATED="1588812358940" MODIFIED="1588812361458"/>
</node>
</node>
</node>
</node>
<node TEXT="fee" POSITION="right" ID="ID_1231123725" CREATED="1588036689042" MODIFIED="1588036691618">
<edge COLOR="#0000ff"/>
<node TEXT="mint()" ID="ID_1037658165" CREATED="1588036692144" MODIFIED="1588036707173"/>
<node TEXT="0.01% of collateral locked" ID="ID_602579316" CREATED="1588036708363" MODIFIED="1588036720545"/>
<node TEXT="split with UI fee account" ID="ID_1727358736" CREATED="1588036725913" MODIFIED="1588036733930"/>
</node>
<node TEXT="Design" POSITION="left" ID="ID_334127339" CREATED="1588806553003" MODIFIED="1588806558892">
<edge COLOR="#00ff00"/>
<node TEXT="decimalsData" ID="ID_1061190185" CREATED="1588806679636" MODIFIED="1588806683520">
<node TEXT="decimals" ID="ID_262387118" CREATED="1588806684491" MODIFIED="1588806689509"/>
<node TEXT="baseDecimals" ID="ID_1758415816" CREATED="1588806690770" MODIFIED="1588806695818"/>
<node TEXT="quoteDecimals" ID="ID_1624733293" CREATED="1588806696854" MODIFIED="1588806699985"/>
<node TEXT="rateDecimals" ID="ID_844783677" CREATED="1588806701700" MODIFIED="1588806706219"/>
</node>
<node TEXT="Maths" ID="ID_863918793" CREATED="1588811037747" MODIFIED="1588811043045">
<node TEXT="uint256 and SafeMath" ID="ID_1048334262" CREATED="1588811043678" MODIFIED="1588811889949">
<node TEXT="decimals uint" ID="ID_883622803" CREATED="1588806560346" MODIFIED="1588806587836"/>
</node>
<node TEXT="Multiplies before divides" ID="ID_291794243" CREATED="1588811047643" MODIFIED="1588811055985"/>
<node TEXT="There will be cases where integer divisions result in dust" ID="ID_1210236004" CREATED="1588811272606" MODIFIED="1588811291714"/>
</node>
<node TEXT="Cannot rely on tokens to have `decimals()`" ID="ID_1390259062" CREATED="1588811082542" MODIFIED="1588811091945"/>
</node>
<node TEXT="Summary" POSITION="right" ID="ID_1451761868" CREATED="1588808453305" MODIFIED="1588808455508">
<edge COLOR="#ff00ff"/>
<node TEXT="Factory for option sellers to escrow collateral (ETH or ERC20 tokens) to create optino tokens and cover tokens" ID="ID_986329927" CREATED="1588810511968" MODIFIED="1588810751261"/>
<node TEXT="Option seller then sells the optino tokens and/or cover tokens on a decentralised (or centralised) exchange" ID="ID_1328045250" CREATED="1588810755628" MODIFIED="1588810800847"/>
<node TEXT="At expiry, optino token holders will receive the appropriate payoff based on the spot price relative to the strike price. Cover token holders will receive the appropriate (collateral - payoff), based on the cover tokens held" ID="ID_1758163885" CREATED="1588810812414" MODIFIED="1588810905341"/>
<node TEXT="Before expiry, holders of both optino and cover tokens can `close()` off the tokens and receive the collateral backing those tokens back" ID="ID_1830069896" CREATED="1588810919342" MODIFIED="1588810964554"/>
</node>
<node TEXT="Risks" POSITION="left" ID="ID_1236362080" CREATED="1588810975871" MODIFIED="1588810978747">
<edge COLOR="#00ffff"/>
<node TEXT="Factory and Optino smart contract bug" ID="ID_943762110" CREATED="1588810979342" MODIFIED="1588810991541"/>
<node TEXT="Price feed" ID="ID_1527464423" CREATED="1588811001079" MODIFIED="1588811242171">
<node TEXT="Vulnerabilities" ID="ID_295885889" CREATED="1588811231734" MODIFIED="1588811234881">
<node TEXT="Bugs" ID="ID_615671711" CREATED="1588811011367" MODIFIED="1588811013237"/>
<node TEXT="Skewing of rates" ID="ID_314199803" CREATED="1588811014394" MODIFIED="1588811018666"/>
<node TEXT="Availability of rates" ID="ID_1159591821" CREATED="1588811254776" MODIFIED="1588811264568"/>
<node TEXT="liquidity" ID="ID_1584744376" CREATED="1588974855185" MODIFIED="1588974860242"/>
</node>
</node>
<node TEXT="Collateral contract vulnerabilities" ID="ID_1968252106" CREATED="1588811101586" MODIFIED="1588811111317">
<node TEXT="Only designed for ETH and ERC20 compliant token contracts" ID="ID_1155049141" CREATED="1588811118585" MODIFIED="1588811131364"/>
</node>
<node TEXT="Centralised ERC20 tokens" ID="ID_603005280" CREATED="1588811153381" MODIFIED="1588811194309">
<node TEXT="Frozen" ID="ID_826481223" CREATED="1588811195194" MODIFIED="1588811198112"/>
<node TEXT="Not redeemable" ID="ID_1875039048" CREATED="1588811198992" MODIFIED="1588811202696"/>
</node>
<node TEXT="Platform" ID="ID_434828414" CREATED="1588888401030" MODIFIED="1588888403722">
<node TEXT="Ethereum network" ID="ID_1409112080" CREATED="1588888404493" MODIFIED="1588888408350">
<node TEXT="Forks" ID="ID_1300950404" CREATED="1588991337770" MODIFIED="1588991339024"/>
<node TEXT="Errors" ID="ID_870575169" CREATED="1588991343443" MODIFIED="1588991345658"/>
</node>
<node TEXT="Solidity" ID="ID_1139468750" CREATED="1588888409299" MODIFIED="1588888418055"/>
</node>
</node>
<node TEXT="TODO" POSITION="right" ID="ID_1005795107" CREATED="1588811600918" MODIFIED="1588811602938">
<edge COLOR="#7c0000"/>
<node TEXT="web3 UI" ID="ID_1112075577" CREATED="1588811604301" MODIFIED="1588811607826">
<node TEXT="Page without requiring web3" ID="ID_1682007458" CREATED="1588811616432" MODIFIED="1588811625639"/>
</node>
<node TEXT="Smart contracts" ID="ID_1953261422" CREATED="1588811609088" MODIFIED="1588811614475">
<node TEXT="Review" ID="ID_1772269442" CREATED="1588811628893" MODIFIED="1588811632540"/>
<node TEXT="Testing" ID="ID_1499726330" CREATED="1588811633360" MODIFIED="1588811635171"/>
<node TEXT="NatSpec comments?" ID="ID_243447355" CREATED="1588811646630" MODIFIED="1588811657151"/>
<node TEXT="recoverTokens(...)" ID="ID_981254687" CREATED="1588813537956" MODIFIED="1588821981620">
<icon BUILTIN="button_ok"/>
</node>
<node TEXT="close and settle permission" ID="ID_924625772" CREATED="1588821992594" MODIFIED="1588870951374">
<icon BUILTIN="button_ok"/>
</node>
<node TEXT="naming - Optino vs Cover in name" ID="ID_1420860593" CREATED="1588886445117" MODIFIED="1588886457732"/>
</node>
<node TEXT="Docs" ID="ID_1438482550" CREATED="1588811642655" MODIFIED="1588811645356">
<node TEXT="How does this work?" ID="ID_1799528057" CREATED="1588811799719" MODIFIED="1588811803517"/>
<node TEXT="Terminology" ID="ID_1699150564" CREATED="1588811804398" MODIFIED="1588811808036"/>
<node TEXT="Smart contract" ID="ID_912927677" CREATED="1588811812049" MODIFIED="1588811934916">
<node TEXT="Reference" ID="ID_1772258582" CREATED="1588811941007" MODIFIED="1588811948182">
<node TEXT="Factory" ID="ID_1365061910" CREATED="1588811956087" MODIFIED="1588811958398"/>
<node TEXT="Optino and Cover tokens" ID="ID_49792591" CREATED="1588811959407" MODIFIED="1588811968192"/>
</node>
<node TEXT="Testing" ID="ID_1721332114" CREATED="1588811920990" MODIFIED="1588811922985"/>
</node>
<node TEXT="Integration" ID="ID_1299707618" CREATED="1588811820041" MODIFIED="1588811824494">
<node TEXT="Accessing data" ID="ID_1616088803" CREATED="1588811828648" MODIFIED="1588811833858"/>
<node TEXT="Minting optino and cover tokens" ID="ID_1234922442" CREATED="1588811834781" MODIFIED="1588811848374"/>
<node TEXT="Closing and settling optino and cover tokens" ID="ID_1941491987" CREATED="1588811851431" MODIFIED="1588811863352"/>
</node>
</node>
</node>
<node TEXT="Notes" POSITION="left" ID="ID_596086674" CREATED="1588817488521" MODIFIED="1588817491550">
<edge COLOR="#007c00"/>
<node TEXT="spot cannot be 0" ID="ID_1068247030" CREATED="1588817491908" MODIFIED="1588817494820">
<node TEXT="Will have to recover" ID="ID_1699170913" CREATED="1588817495877" MODIFIED="1588817499575"/>
</node>
</node>
</node>
</map>
