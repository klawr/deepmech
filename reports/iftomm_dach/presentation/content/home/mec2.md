+++
weight = 40
+++

### mec2

<section>
<pre id="pre40">
<p style="margin-bottom: -1em">&ltmec-2  width="501" height="401" grid cartesian x0="100" y0="100"&gt</p>
<code class="hljs" id="code40" data-trim>
{
    "nodes":[
        {"id":"A0","x":0,"y":0,"base":true},
        {"id":"B0","x":200,"y":0,"base":true},
        {"id":"A","x":0,"y":50},
        {"id":"B","x":250,"y":120},
        {"id":"C","x":125,"y":150},
        {"id":"C0","x":350,"y":0,"base":true}
    ],
    "constraints":[
        {"id":"a","p1":"A0","p2":"A","len":{"type":"const"},
              "ori":{"type":"drive","func":"linear","Dt":5}},
        {"id":"b","p1":"A","p2":"B","len":{"type":"const"}},
        {"id":"c","p1":"B0","p2":"B","len":{"type":"const"}},
        {"id":"b2","p1":"A","p2":"C","len":{"type":"const"},"ori":{"type":"const","ref":"b"}}
    ],
    "views":[
        {"show":"pos","of":"C","as":"trace","mode":"preview","Dt":5,"fill":"orange"},
        {"show":"vel","of":"C","as":"vector","at":"C0"}
    ]
}
</mec-2>
</code>
<p style="position: relative; margin-top: 24.5em">&lt/mec-2&gt</p>
</pre>

<mec-2 id="mec40" width="501" height="401" grid cartesian x0="100" y0="100"></mec-2>

<script>
    const mec40 = document.getElementById('mec40');
    const code40 = document.getElementById('code40');
    code40.contentEditable = true;
    code40.spellcheck = false;
    code40.addEventListener('input', () => {
        mec40.innerHTML = code40.textContent
        mec40._model.reset();
        mec40.init();
    });
    mec40.innerHTML = code40.textContent;
</script>

</section>
