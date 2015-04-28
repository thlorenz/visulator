# visulator [![build status](https://secure.travis-ci.org/thlorenz/visulator.png)](http://travis-ci.org/thlorenz/visulator)

A machine emulator that visualizes how each instruction is processed

## Status

**MAD SCIENCE**

[ Play with it](https://thlorenz.github.io/visulator)

## API and Notes

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="cu:: _dec"><span class="type-signature"></span>cu:: _dec<span class="signature">(opcode, asm)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Decrement a register</p>
<pre><code class="lang-asm">48   dec    eax
49   dec    ecx
4a   dec    edx
4b   dec    ebx
4c   dec    esp
4d   dec    ebp
4e   dec    esi
4f   dec    edi</code></pre>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>asm</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js#L168">lineno 168</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::next"><span class="type-signature"></span>cu::next<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Fetches, decodes and executes next instruction and stores result.</p>
<p>This implementation totally ignores a few things about modern processors and instead uses
a much simpler algorithm to fetch and execute instructions and store the results.</p>
<p>Here are some concepts that make modern processors faster, but are not employed here, followed
by the simplified algorightm we actually use here.</p>
<p><strong>Pipelining</strong></p>
<ul>
<li>instructions are processed in a pipe line fashion with about 5 stages, each happening  in parallel
for multiple instructions<ul>
<li>load instruction</li>
<li>decode instruction</li>
<li>fetch data</li>
<li>execute instruction</li>
<li>write results for instruction</li>
</ul>
</li>
<li>at a given time instruction A is loaded,  B is decoded, data is fetched for C, D is executing
and results for E are written</li>
<li>see: <a href="http://www.pctechguide.com/cpu-architecture/moores-law-in-it-architecture">moores-law-in-it-architecture</a></li>
</ul>
<p><strong>Caches</strong></p>
<ul>
<li>modern processors have L1, L2 and L3 caches</li>
<li>L1 and L2 are on the processor while L3 is connected via a high speed bus</li>
<li>data that is used a lot and namely the stack and code about to be executed is usually
found in one of these caches, saving a more expensive trip to main memory</li>
</ul>
<p><strong>Branch Prediction</strong></p>
<ul>
<li>in order to increase speed the processor tries to predict which branch of code is executed
next in order to pre-fetch instructions</li>
<li>IA-64 replaces this by predication which even allows the processor to execute all
possible branch paths in parallel</li>
</ul>
<p><strong>Translation to RISC like micro-instructions</strong></p>
<ul>
<li>starting with the Pentium Pro (P6) instructions are translated into RISC like
micro-instructions</li>
<li>these micro-instructions are then executed (instead of the original ones) on a
highly advanced core</li>
<li>see: <a href="http://www.pctechguide.com/cpu-architecture/pentium-pro-p6-6th-generation-x86-microarchitecture">pentium-pro-p6-6th-generation-x86-microarchitecture</a></li>
</ul>
<p><strong>Simplified Algorithm</strong></p>
<ul>
<li>1) fetch next instruction (always from main memory -- caches don't exist here)</li>
<li>2) decode instruction and decide what to do</li>
<li>3) execute instruction, some directly here and others via the ALU</li>
<li>4) store the result in registers/memory</li>
<li><p>5) goto 1</p>
</li>
<li><p>and 2. basically become one step since we just call a function named after
the opcode of the mnemonic.</p>
</li>
</ul>
<p>We then fetch more bytes from the code in order to complete the instruction from memory (something
that is inefficient and not done in the real world, where multiple instructions are pre-fetched
instead).</p>
<p>The decoder is authored using <a href="http://ref.x86asm.net/coder32.html">this information</a>.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js#L38">lineno 38</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu:_push_reg"><span class="type-signature"></span>cu:_push_reg<span class="signature">(opcode)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Push 32 bit register onto stack.
<a href="http://ref.x86asm.net/coder32.html#x50">x50</a></p>
<pre><code class="lang-asm">50   push   eax
51   push   ecx
53   push   ebx
52   push   edx
54   push   esp
55   push   ebp
56   push   esi
57   push   edi</code></pre>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/cu.js#L143">lineno 143</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="hexstring"><span class="type-signature"></span>hexstring<span class="signature">(x)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Converts given number to a two digit hex str</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>x</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>number between 0x00 and 0xff</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/hexstring.js">hexstring.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/hexstring.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>two digit string representation</p>
</div>
</dd>
<dt>
<h4 class="name" id="registers::_flagMasks"><span class="type-signature"></span>registers::_flagMasks<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Flags representation for each case of ONE flag set at a time.
Used to isolate each flag for flag operations</p>
<p>see: <a href="http://en.wikipedia.org/wiki/FLAGS_register">wiki flags register</a></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js#L25">lineno 25</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::assign"><span class="type-signature"></span>registers::assign<span class="signature">(regs)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Assigns given registers with the supplied values.
Leaves all other flags alone.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>regs</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js#L127">lineno 127</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::getFlag"><span class="type-signature"></span>registers::getFlag<span class="signature">(flag)</span><span class="type-signature"> &rarr; {Number}</span></h4>
</dt>
<dd>
<div class="description">
<p>Returns a given flag</p>
<p> First masks out the bit of the flag we are interested in
and then shifts our flag bit into lowest bit.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js#L84">lineno 84</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>1</code> if flag is set, otherwise <code>0</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Number</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::setFlag"><span class="type-signature"></span>registers::setFlag<span class="signature">(flag)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Sets a given flag</p>
<p> <code>or</code>s flags with mask that will preserve all other flags and set
our flag since that bit is set in the mask.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js#L98">lineno 98</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::unsetFlag"><span class="type-signature"></span>registers::unsetFlag<span class="signature">(flag)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Unsets a given flag</p>
<p>First we invert the mask for the flag to unset.
Then we <code>and</code> the flags with that mask which unsets
our flag since that's the only bit in the mask that's <code>0</code>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/x86/regs.js#L112">lineno 112</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

GPL3
